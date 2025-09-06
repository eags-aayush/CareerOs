import React, { useMemo, useState, useEffect } from 'react';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { ParsedSection, FeedbackData } from '../types';
import { PrinterIcon } from './icons/PrinterIcon';
import { DocumentDownloadIcon } from './icons/DocumentDownloadIcon';
import { CheckCircleIcon } from './icons/CheckCircleIcon';
import { PlusCircleIcon } from './icons/PlusCircleIcon';
import { ChevronDownIcon } from './icons/ChevronDownIcon';
import { useTranslation } from './LanguageProvider';
import { SearchIcon } from './icons/SearchIcon';
import { VideoCameraIcon } from './icons/VideoCameraIcon';
import ProgressBar from './ProgressBar';
import FeedbackForm from './FeedbackForm';
import { trackEvent } from '../services/analyticsService';
import Modal from './Modal';


interface ResultsDisplayProps {
  response: string;
  onReset: () => void;
}

const ResultsDisplay: React.FC<ResultsDisplayProps> = ({ response, onReset }) => {
  const { t } = useTranslation();
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({});
  const [isExportingPdf, setIsExportingPdf] = useState(false);
  const [exportError, setExportError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [completedTasks, setCompletedTasks] = useState<Record<string, boolean>>({});
  const [isFeedbackModalOpen, setFeedbackModalOpen] = useState(false);

  // Roadmap Progress Logic
  const roadmapTasks = useMemo(() => {
    const roadmapSection = response.split('## 3. Learning Roadmap')[1] || '';
    return roadmapSection.match(/^\s*\*\s.*$/gm)?.map(task => task.trim()) || [];
  }, [response]);

  const progress = useMemo(() => {
    if (roadmapTasks.length === 0) return 0;
    const completedCount = Object.values(completedTasks).filter(Boolean).length;
    return Math.round((completedCount / roadmapTasks.length) * 100);
  }, [completedTasks, roadmapTasks]);

  useEffect(() => {
    const savedProgress = localStorage.getItem('careerOSProgress');
    if (savedProgress) {
      setCompletedTasks(JSON.parse(savedProgress));
    }
  }, []);

  const handleToggleTask = (task: string) => {
    const newCompletedTasks = { ...completedTasks, [task]: !completedTasks[task] };
    setCompletedTasks(newCompletedTasks);
    localStorage.setItem('careerOSProgress', JSON.stringify(newCompletedTasks));
    trackEvent('task_toggled', { task, completed: newCompletedTasks[task] });
  };
  
  const handleClearProgress = () => {
    setCompletedTasks({});
    localStorage.removeItem('careerOSProgress');
    trackEvent('progress_cleared');
  }

  // Section Parsing & Toggling
  const parsedSections: ParsedSection[] = useMemo(() => {
    if (!response) return [];
    return response.split('## ')
      .filter(part => part.trim() !== '')
      .map(part => {
        const lines = part.split('\n');
        const title = lines[0].trim();
        const content = lines.slice(1).join('\n').trim();
        return { title, content };
      });
  }, [response]);

  useEffect(() => {
    const initialState: Record<string, boolean> = {};
    parsedSections.forEach(section => {
      initialState[section.title] = true;
    });
    setOpenSections(initialState);
  }, [parsedSections]);

  const handleToggleSection = (title: string) => {
    setOpenSections(prev => ({...prev, [title]: !prev[title]}));
  };

  // PDF & Print Logic
  const handlePrint = () => {
    trackEvent('print_report');
    window.print();
  };
  
  const handleExportPdf = async () => {
    trackEvent('export_pdf_started');
    setIsExportingPdf(true);
    setExportError(null);
    const reportElement = document.querySelector('.printable-area');
    if (!reportElement) {
        setExportError(t('results.errors.pdfError'));
        setIsExportingPdf(false);
        trackEvent('export_pdf_failed', { reason: 'Element not found' });
        return;
    }

    const allOpen: Record<string, boolean> = {};
    parsedSections.forEach(section => { allOpen[section.title] = true; });
    setOpenSections(allOpen);
    
    await new Promise(resolve => setTimeout(resolve, 100));

    try {
        const canvas = await html2canvas(reportElement as HTMLElement, {
            scale: 2, useCORS: true, logging: false,
            backgroundColor: document.documentElement.classList.contains('dark') ? '#0f172a' : '#ffffff',
        });

        const imgData = canvas.toDataURL('image/png');
        const pdf = new jsPDF({ orientation: 'p', unit: 'mm', format: 'a4', compress: true });
        const { width: pdfWidth, height: pdfHeight } = pdf.internal.pageSize;
        const ratio = canvas.width / canvas.height;
        const imgWidth = pdfWidth;
        const imgHeight = imgWidth / ratio;
        let position = 0;

        pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight, undefined, 'FAST');
        let heightLeft = imgHeight - pdfHeight;

        while (heightLeft > 0) {
            position -= pdfHeight;
            pdf.addPage();
            pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight, undefined, 'FAST');
            heightLeft -= pdfHeight;
        }

        pdf.save('CareerOS_Roadmap.pdf');
        trackEvent('export_pdf_success');
    } catch (err) {
        console.error("Failed to export PDF:", err);
        setExportError(t('results.errors.pdfError'));
        trackEvent('export_pdf_failed', { reason: err instanceof Error ? err.message : 'Unknown' });
    } finally {
        setIsExportingPdf(false);
    }
  };

  // Content Rendering
  const highlightText = (text: string, highlight: string) => {
    if (!highlight.trim()) return text;
    const regex = new RegExp(`(${highlight})`, 'gi');
    return text.replace(regex, '<mark class="bg-yellow-200 dark:bg-yellow-600 rounded px-1">$1</mark>');
  }
  
  const processAndHighlight = (content: string, term: string) => {
      let processed = renderResourceBadges(content);
      processed = embedYouTubeVideos(processed);
      return highlightText(processed, term);
  }
  
  const embedYouTubeVideos = (line: string) => {
    const youtubeRegex = /(https?:\/\/(?:www\.)?youtube\.com\/watch\?v=([\w-]+)(?:&[^\s]*)?)/g;
    return line.replace(youtubeRegex, (match, url, videoId) => {
      return `
        <div class="my-4">
            <div class="flex items-center gap-2 mb-2 text-sm font-semibold text-slate-600 dark:text-slate-400">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" class="w-5 h-5 text-red-600"><path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clip-rule="evenodd" /></svg>
                ${t('results.videoResource')}
            </div>
            <div class="aspect-w-16 aspect-h-9 rounded-lg overflow-hidden shadow-md border border-slate-200 dark:border-slate-700">
                <iframe src="https://www.youtube.com/embed/${videoId}" 
                        frameborder="0" 
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                        allowfullscreen 
                        class="w-full h-full">
                </iframe>
            </div>
        </div>`;
    });
  };
  
  const renderResourceBadges = (line: string) => {
    return line.replace(/\[(Free|Paid|Certificate)\]/gi, (match, tag) => {
        let colorClasses = '';
        switch (tag.toLowerCase()) {
            case 'free': colorClasses = 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300'; break;
            case 'paid': colorClasses = 'bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-300'; break;
            case 'certificate': colorClasses = 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300'; break;
            default: colorClasses = 'bg-slate-100 text-slate-800 dark:bg-slate-700 dark:text-slate-300';
        }
        return `<span class="inline-block text-xs font-semibold px-2 py-1 rounded-full ${colorClasses}">${tag}</span>`;
    });
  };

  const renderSkillGaps = (line: string) => { /* ... implementation unchanged ... */ };
  
  const renderRoadmap = (content: string) => {
    const sprints = content.split('### ').slice(1);
    return (
        <div className="space-y-4">
            <div className="flex justify-between items-center bg-slate-100 dark:bg-slate-700/50 p-3 rounded-lg">
                <div>
                    <h4 className="font-semibold">{t('results.progressTitle')}</h4>
                    <p className="text-sm text-slate-500 dark:text-slate-400">{t('results.progressSubtitle')}</p>
                </div>
                <button 
                    onClick={handleClearProgress}
                    className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline"
                >
                    {t('results.buttons.clearProgress')}
                </button>
            </div>
            <ProgressBar progress={progress} />
            <div className="relative border-l-2 border-indigo-200 dark:border-indigo-700 pl-8 space-y-12 py-4">
                {sprints.map((sprint, index) => {
                    const lines = sprint.split('\n');
                    const title = lines[0].trim();
                    const sprintContent = lines.slice(1).map(l => l.trim()).filter(l => l);
                    return (
                        <div key={index} className="relative">
                            <div className="absolute -left-[42px] top-1 h-8 w-8 bg-indigo-600 rounded-full text-white flex items-center justify-center font-bold ring-8 ring-slate-50 dark:ring-slate-800">{index + 1}</div>
                            <h4 className="text-xl font-bold text-slate-800 dark:text-slate-100 mb-2">{title}</h4>
                            <ul className="space-y-3">
                                {sprintContent.map((item, itemIdx) => (
                                    <li key={itemIdx} className="flex items-start gap-3">
                                        <input 
                                            type="checkbox" 
                                            id={`task-${index}-${itemIdx}`} 
                                            checked={!!completedTasks[item]} 
                                            onChange={() => handleToggleTask(item)}
                                            className="mt-1 h-4 w-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
                                        />
                                        <label htmlFor={`task-${index}-${itemIdx}`} className={`flex-1 text-slate-600 dark:text-slate-400 ${completedTasks[item] ? 'line-through text-slate-400 dark:text-slate-500' : ''}`}
                                             dangerouslySetInnerHTML={{ __html: processAndHighlight(item.substring(2), searchTerm)}}>
                                        </label>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    );
                })}
            </div>
        </div>
    );
  };
  
  // FIX: Implemented the renderMarkdownTable function to parse and render markdown tables, fixing a type error where it previously returned 'void'.
  const renderMarkdownTable = (content: string) => {
    const lines = content.split('\n').filter(line => line.trim().startsWith('|'));
    if (lines.length < 2) {
      // Fallback for non-table content
      return <div dangerouslySetInnerHTML={{ __html: processAndHighlight(content, searchTerm) }} />;
    }

    const headerLine = lines[0];
    const separatorLine = lines[1];
    
    // Basic validation for a markdown table
    if (!separatorLine || !separatorLine.includes('---')) {
        return <div dangerouslySetInnerHTML={{ __html: processAndHighlight(content, searchTerm) }} />;
    }

    const headers = headerLine.split('|').map(h => h.trim()).filter(Boolean);
    const dataLines = lines.slice(2);

    return (
      <div className="overflow-x-auto my-4 rounded-lg border border-slate-200 dark:border-slate-700">
        <table className="min-w-full divide-y divide-slate-200 dark:divide-slate-700">
          <thead className="bg-slate-50 dark:bg-slate-700/50">
            <tr>
              {headers.map((header, index) => (
                <th key={index} scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-300 uppercase tracking-wider" dangerouslySetInnerHTML={{ __html: highlightText(header, searchTerm) }}>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-white dark:bg-slate-800 divide-y divide-slate-200 dark:divide-slate-700">
            {dataLines.map((row, rowIndex) => {
                const cells = row.split('|').map(cell => cell.trim()).filter(Boolean);
                if (cells.length === 0) return null;
                return (
                  <tr key={rowIndex} className="hover:bg-slate-50 dark:hover:bg-slate-700/50">
                    {cells.map((cell, cellIndex) => (
                      <td key={cellIndex} className="px-6 py-4 whitespace-nowrap text-sm text-slate-600 dark:text-slate-400" dangerouslySetInnerHTML={{__html: highlightText(cell, searchTerm)}}>
                      </td>
                    ))}
                  </tr>
                )
            })}
          </tbody>
        </table>
      </div>
    );
  };

  const renderContent = (section: ParsedSection) => {
    const titleLower = section.title.toLowerCase();
    if (titleLower.includes('roadmap') || titleLower.includes('रोडमैप') || titleLower.includes('रोडमॅप')) {
        return renderRoadmap(section.content);
    }
    
    if (titleLower.includes('simulation') || titleLower.includes('सिमुलेशन') || titleLower.includes('सिम्युलेशन')) {
        if (section.content.includes('|')) return renderMarkdownTable(section.content);
    }
    
    const contentHtml = section.content.split('\n').map((line, index) => {
      line = line.trim();
      if (!line) return '';
      if (line.startsWith('> ')) return `<blockquote class="pl-4 italic border-l-4 border-slate-300 dark:border-slate-600 text-slate-500 dark:text-slate-400 my-4">${line.substring(2)}</blockquote>`;
      if (line.startsWith('#### ')) return `<h4 class="text-lg font-semibold mt-5 mb-2 text-slate-600 dark:text-slate-300">${line.substring(5)}</h4>`;
      if (line.startsWith('### ')) return `<h3 class="text-xl font-semibold mt-6 mb-2 text-slate-700 dark:text-slate-200">${line.substring(4)}</h3>`;
      if (line.startsWith('**')) return `<p class="font-semibold text-slate-600 dark:text-slate-300 mt-2">${line.replace(/\*\*/g, '')}</p>`;
      if (line.startsWith('* ')) {
         if (line.includes('(You have this!)') || line.includes(t('results.skillTagHave'))) {
            return `<div class="flex items-center gap-2 text-green-700 dark:text-green-400 mb-1"><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="h-5 w-5 flex-shrink-0"><path stroke-linecap="round" stroke-linejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg><span>${line.replace(/\(You have this!\)/, '').replace(t('results.skillTagHave'),'').substring(2).trim()}</span></div>`;
         }
         if (line.includes('(To learn)') || line.includes(t('results.skillTagLearn'))) {
            return `<div class="flex items-center gap-2 text-blue-700 dark:text-blue-400 mb-1"><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="h-5 w-5 flex-shrink-0"><path stroke-linecap="round" stroke-linejoin="round" d="M12 9v6m3-3H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" /></svg><span>${line.replace(/\(To learn\)/, '').replace(t('results.skillTagLearn'),'').substring(2).trim()}</span></div>`;
         }
         return `<li class="ml-5 list-disc text-slate-600 dark:text-slate-400">${renderResourceBadges(line.substring(2))}</li>`;
      }
      return `<p class="text-slate-600 dark:text-slate-400 mb-2">${processAndHighlight(line, '')}</p>`; // No search highlight here, handled below
    }).join('');

    return <div dangerouslySetInnerHTML={{ __html: processAndHighlight(contentHtml, searchTerm) }} />;
  };

  const handleFeedbackSubmit = (feedback: FeedbackData) => {
    trackEvent('feedback_submitted', feedback);
    setFeedbackModalOpen(false);
  };
  
  return (
    <>
    <div className="bg-white dark:bg-slate-800 p-6 sm:p-8 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700 animate-fade-in">
      <div className="printable-area text-slate-800 dark:text-slate-200">
        <h2 className="text-3xl font-bold text-center mb-2">{t('results.title')}</h2>
        <p className="text-center text-slate-500 dark:text-slate-400 mb-8">{t('results.subtitle')}</p>
        
        <div className="relative mb-6 no-print">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                <SearchIcon className="h-5 w-5 text-slate-400" />
            </div>
            <input 
                type="text" 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder={t('results.searchPlaceholder')}
                className="block w-full rounded-md border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 py-2 pl-10 pr-3 text-sm placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:border-indigo-500 focus:ring-indigo-500"
            />
        </div>

        <div className="space-y-4">
          {parsedSections.map((section, index) => (
            <div key={index} className={`rounded-lg bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 overflow-hidden ${index > 0 ? 'page-break' : ''}`}>
              <button
                className="w-full flex justify-between items-center p-4 text-left"
                onClick={() => handleToggleSection(section.title)}
                aria-expanded={openSections[section.title]}
                aria-controls={`section-content-${index}`}
                title={t('results.toggleSection')}
              >
                <h2 className="text-2xl font-bold text-indigo-700 dark:text-indigo-400" dangerouslySetInnerHTML={{__html: highlightText(section.title, searchTerm)}}></h2>
                <ChevronDownIcon className={`h-6 w-6 text-indigo-500 transform transition-transform duration-300 ${openSections[section.title] ? 'rotate-180' : ''}`} />
              </button>
              {openSections[section.title] && (
                <div id={`section-content-${index}`} className="p-4 pt-0">
                  {renderContent(section)}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      <div className="mt-8 pt-6 border-t border-slate-200 dark:border-slate-700 space-y-4 no-print">
        <div className="text-center">
            <h3 className="font-semibold text-slate-700 dark:text-slate-200">{t('results.feedback.title')}</h3>
            <p className="text-sm text-slate-500 dark:text-slate-400">{t('results.feedback.subtitle')}</p>
            <button onClick={() => setFeedbackModalOpen(true)} className="mt-3 text-sm font-semibold text-indigo-600 dark:text-indigo-400 hover:underline">
                 {t('results.buttons.giveFeedback')}
            </button>
        </div>
        <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
            <button onClick={onReset} className="bg-indigo-600 text-white font-semibold py-2 px-6 rounded-lg shadow-sm hover:bg-indigo-700 transition-colors duration-200 w-full sm:w-auto">
                {t('results.buttons.startNew')}
            </button>
            <button onClick={handlePrint} className="flex items-center justify-center gap-2 bg-slate-600 text-white font-semibold py-2 px-6 rounded-lg shadow-sm hover:bg-slate-700 transition-colors duration-200 w-full sm:w-auto">
                <PrinterIcon className="h-5 w-5" /> {t('results.buttons.print')}
            </button>
            <button onClick={handleExportPdf} disabled={isExportingPdf} className="flex items-center justify-center gap-2 bg-slate-800 text-white font-semibold py-2 px-6 rounded-lg shadow-sm hover:bg-slate-900 transition-colors duration-200 w-full sm:w-auto disabled:bg-slate-500 disabled:cursor-wait">
                <DocumentDownloadIcon className="h-5 w-5" /> {isExportingPdf ? t('results.buttons.exportingPdf') : t('results.buttons.exportPdf')}
            </button>
        </div>
      </div>
      {exportError && <p className="text-center text-red-500 text-sm mt-4 no-print">{exportError}</p>}
    </div>

    <Modal isOpen={isFeedbackModalOpen} onClose={() => setFeedbackModalOpen(false)} title={t('results.feedback.title')}>
        <FeedbackForm onSubmit={handleFeedbackSubmit} onCancel={() => setFeedbackModalOpen(false)} />
    </Modal>
    </>
  );
};

export default ResultsDisplay;