import React, { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "motion/react";
import { ChevronRight, ChevronLeft, X, Play, HelpCircle } from "lucide-react";
import { Job, Application } from "../types";

export interface TourStep {
  selector: string;
  title: string;
  content: string;
  screen?: string;
  tab?: "candidates" | "applications"; // candidates page tab
  setupAction?: (helpers: {
    setSelectedPipelineJobId: (id: string) => void;
    setTourForcedTab: (tab: "candidates" | "applications") => void;
    setTourForcedDept: (dept: string) => void;
    setTourForcedJobId: (jobId: string) => void;
    setSelectedFeedbackAppId: (id: string) => void;
    jobs: Job[];
    applications: Application[];
  }) => void;
  placement?: "top" | "bottom" | "left" | "right";
}

interface OnboardingTourProps {
  isActive: boolean;
  onClose: () => void;
  currentStep: number;
  setStep: (step: number) => void;
  setSelectedPipelineJobId: (id: string) => void;
  setTourForcedTab: (tab: "candidates" | "applications") => void;
  setTourForcedDept: (dept: string) => void;
  setTourForcedJobId: (jobId: string) => void;
  setSelectedFeedbackAppId: (id: string) => void;
  setCurrentScreen: (screen: string) => void;
  jobs: Job[];
  applications: Application[];
  setIsMobileMoreOpen?: (open: boolean) => void;
}

export const OnboardingTour: React.FC<OnboardingTourProps> = ({
  isActive,
  onClose,
  currentStep,
  setStep,
  setSelectedPipelineJobId,
  setTourForcedTab,
  setTourForcedDept,
  setTourForcedJobId,
  setSelectedFeedbackAppId,
  setCurrentScreen,
  jobs,
  applications,
  setIsMobileMoreOpen,
}) => {
  const [targetRect, setTargetRect] = useState<DOMRect | null>(null);
  const [placement, setPlacement] = useState<"top" | "bottom" | "left" | "right">("bottom");
  const [coords, setCoords] = useState({ top: 0, left: 0 });
  const [currentVibe, setCurrentVibe] = useState(0); // For forcing triggers

  const tooltipRef = useRef<HTMLDivElement>(null);

  // Define the comprehensive consolidated 27-step tour order matching business workflows!
  const tourSteps: TourStep[] = [
    // --- PART 1: SIDEBAR INTERACTIVE ONBOARDING ---
    {
      selector: "#sidebar-dashboard",
      title: "Dashboard Overview",
      content: "Your central hub for tracking high-level recruitment speeds, success placement ratios, and division health metrics.",
      screen: "dashboard",
      placement: "right"
    },
    {
      selector: "#sidebar-jobs",
      title: "Job Openings Registry",
      content: "Manage active sourcing roles, specify locations or deadlines, and view linked candidate submission summaries.",
      screen: "dashboard",
      placement: "right"
    },
    {
      selector: "#sidebar-candidates",
      title: "People Directory",
      content: "Review candidate profiles, trace active tracking statuses, and link talented profiles with open vacancies.",
      screen: "dashboard",
      placement: "right"
    },
    {
      selector: "#sidebar-pipeline",
      title: "Kanban Hiring Board",
      content: "Monitor applicants progressing through hiring stages and advance qualified performers using interactive Kanban boards.",
      screen: "dashboard",
      placement: "right"
    },
    {
      selector: "#sidebar-feedback",
      title: "Assessments Ledger",
      content: "Compare interview feedback records and technical scorecard grades to verify hiring selections across departments.",
      screen: "dashboard",
      placement: "right"
    },
    {
      selector: "#sidebar-ai-generator",
      title: "Generative Sourcing Bot",
      content: "Write tailored, engaging job descriptions instantly using state-of-the-art Gemini AI capabilities.",
      screen: "dashboard",
      placement: "right"
    },
    {
      selector: "#sidebar-email-dispenser",
      title: "Campaign Dispatcher",
      content: "Coordinate batch mailing cycles to notify applicants when position requirements change or roles are archived.",
      screen: "dashboard",
      placement: "right"
    },

    // --- PART 2: DASHBOARD PAGE WORKFLOW ---
    {
      selector: "#cohort-select-container",
      title: "Cohort Isolation Tool",
      content: "Isolate pipeline conversion charts and analytics to single open positions to eliminate historical hiring bias.",
      screen: "dashboard",
      placement: "bottom"
    },
    {
      selector: "#dashboard-kpi-grid",
      title: "Strategic KPI Counters",
      content: "Track active jobs count, total registered candidate files, active applications, and successful hired counts.",
      screen: "dashboard",
      placement: "bottom"
    },
    {
      selector: "#dashboard-funnel-container",
      title: "Recruitment Funnel Chart",
      content: "Observe stage transition percentages to identify candidate drop-off sources and resolve pipeline constraints.",
      screen: "dashboard",
      placement: "top"
    },
    {
      selector: "#dashboard-gauge-container",
      title: "Throughput Health Score",
      content: "Audit your overall recruitment velocity calculated programmatically from active and hired candidates ratios.",
      screen: "dashboard",
      placement: "left"
    },

    // --- PART 3: JOBS REGISTRY WORKFLOW ---
    {
      selector: "#jobs-filter-bar",
      title: "Requisition Filtering Bar",
      content: "Refine position lists instantly by typing key title terms, selecting statuses, or filtering specific departments.",
      screen: "jobs",
      placement: "bottom"
    },
    {
      selector: "#jobs-table",
      title: "Active Positions Database",
      content: "Assess role requirements, check submission deadlines, monitor fulfillment rates, and review active candidate counts.",
      screen: "jobs",
      placement: "top"
    },
    {
      selector: "#btn-add-job",
      title: "Publish New Openings",
      content: "Click here to construct new hiring positions, outline required skills, and initiate recruitment campaigns.",
      screen: "jobs",
      placement: "left"
    },

    // --- PART 4: CANDIDATES DATABASE WORKFLOW ---
    {
      selector: "#candidates-tab-master",
      title: "Talent Dossier Tab",
      content: "Audit primary lead profiles, view registered resumes, and link candidate records to active open positions.",
      screen: "candidates",
      tab: "candidates",
      placement: "bottom"
    },
    {
      selector: "#candidates-cand-table",
      title: "Directory Search & Candidate DB",
      content: "Query and select registered talent profile entries by checking full names, email addresses, or phone lines in the search bar. Inspect detailed profiles and trace recent timeline activities from the database table.",
      screen: "candidates",
      tab: "candidates",
      placement: "top"
    },
    {
      selector: "#candidates-tab-linked",
      title: "Applications Dossier Tab",
      content: "Switch to review active candidate applications across active openings. Let's switch tabs now to see it.",
      screen: "candidates",
      tab: "applications",
      placement: "bottom"
    },
    {
      selector: "#candidates-app-table",
      title: "Linked Applications Search & DB",
      content: "Query candidate names or opening jobs inside the search filter bar above to filter workflow items dynamically, then view current statuses, pipeline stages, or delete submissions directly in the applications datatable.",
      screen: "candidates",
      tab: "applications",
      placement: "top"
    },

    // --- PART 5: INTERACTIVE ATS PIPELINE BOARD ---
    {
      selector: "#pipeline-select-container",
      title: "Position Board Selection",
      content: "Select a job opening to load corresponding candidates into their respective interactive Kanban hiring columns.",
      screen: "pipeline",
      setupAction: ({ setSelectedPipelineJobId, jobs }) => {
        if (jobs.length > 0) {
          setSelectedPipelineJobId(jobs[0].jobId);
        }
      },
      placement: "bottom"
    },
    {
      selector: "#pipeline-columns-container",
      title: "Kanban Board & Sourcing Pipeline",
      content: "Monitor candidates migrating through successive tracking phases containing distinct metrics. You can drag or select cards to advance candidates forward, review documents, or process terminal rejections.",
      screen: "pipeline",
      setupAction: ({ setSelectedPipelineJobId, jobs }) => {
        if (jobs.length > 0) {
          setSelectedPipelineJobId(jobs[0].jobId);
        }
      },
      placement: "top"
    },

    // --- PART 6: CONSOLIDATED POSITION EVALUATIONS ---
    {
      selector: "#feedback-cascading-filters",
      title: "Cascading Selections Filter",
      content: "Specify a department division first, which dynamically loads the corresponding position list for review.",
      screen: "feedback",
      setupAction: ({ setTourForcedDept, setTourForcedJobId, setSelectedFeedbackAppId, jobs, applications }) => {
        // Automatically find a job + dept and open feedback card if elements are available
        const withInterview = applications.find(app => app.stage === "Interview");
        if (withInterview) {
          const matchedJob = jobs.find(j => j.jobId === withInterview.jobId);
          if (matchedJob) {
            setTourForcedDept(matchedJob.department);
            setTourForcedJobId(matchedJob.jobId);
            setSelectedFeedbackAppId(withInterview.applicationId);
            return;
          }
        }
        if (jobs.length > 0) {
          setTourForcedDept(jobs[0].department);
          setTourForcedJobId(jobs[0].jobId);
          if (applications.length > 0) {
            setSelectedFeedbackAppId(applications[0].applicationId);
          }
        }
      },
      placement: "bottom"
    },
    {
      selector: "#feedback-assessments-summary",
      title: "Round Scores & Statistics",
      content: "Review consolidated evaluations count, aggregated average performance grades, and latest interview recommendations.",
      screen: "feedback",
      placement: "top"
    },
    {
      selector: "#feedback-add-eval-button",
      title: "Add Reviewer Feedbacks",
      content: "Register structured reviewer scorecards, document technical grades, and record interview recommendations.",
      screen: "feedback",
      placement: "left"
    },

    // --- PART 7: GENERATIVE SOURCING BOT ---
    {
      selector: "#ai-jd-generator-input",
      title: "JD Requirements Input",
      content: "Specify targeted titles, departments, skills, and qualifications parameters to feed the Gemini generation model.",
      screen: "ai-generator",
      placement: "right"
    },

    // --- PART 8: MAILING CYCLE CAMPAIGNS ---
    {
      selector: "#mailing-job-select-container",
      title: "Closed Requisitions Selector",
      content: "Select an archived or closed job position to retrieve all linked applicant pipelines that require notification.",
      screen: "email-dispenser",
      placement: "bottom"
    },
    {
      selector: "#mailing-resend-key-box",
      title: "Integrated Mailer Token",
      content: "Configure Resend API keys locally to authorize mailing campaigns securely through standard client proxies.",
      screen: "email-dispenser",
      placement: "bottom"
    },
    {
      selector: "#mailing-recipients-container",
      title: "Campaign Selection & Batch Dispatch",
      content: "Review candidate profiles in the grid, toggle update checkboxes, and click on the dispatcher button to trigger batch emails and transition their recruitment stages simultaneously.",
      screen: "email-dispenser",
      placement: "top"
    },
  ];

  const currentStepData = tourSteps[currentStep];

  // Perform active step-specific side effects (such as screen updates or data selection)
  useEffect(() => {
    if (!isActive || !currentStepData) return;

    // Navigate page context programmatically if applicable
    if (currentStepData.screen) {
      setCurrentScreen(currentStepData.screen);
      // Update hash routing for complete sync
      window.location.hash = currentStepData.screen;
    }

    // Isolate tab selection for Candidates Screen
    if (currentStepData.tab) {
      setTourForcedTab(currentStepData.tab);
    }

    // Manage mobile 'More Sourcing Tools' drawer programmatically based on active step context
    const isMobile = window.innerWidth < 768;
    if (isMobile && setIsMobileMoreOpen) {
      const isMoreSectionStep = [
        "#sidebar-feedback",
        "#sidebar-ai-generator",
        "#sidebar-email-dispenser"
      ].includes(currentStepData.selector);
      if (isMoreSectionStep) {
        setIsMobileMoreOpen(true);
      } else {
        setIsMobileMoreOpen(false);
      }
    }

    // Trigger customizable setups (such as demo selections)
    if (currentStepData.setupAction) {
      currentStepData.setupAction({
        setSelectedPipelineJobId,
        setTourForcedTab,
        setTourForcedDept,
        setTourForcedJobId,
        setSelectedFeedbackAppId,
        jobs,
        applications,
      });
    }

    // Trigger state recalibration helper on layout stabilization delay
    const t = setTimeout(() => {
      setCurrentVibe(prev => prev + 1);
    }, isMobile ? 250 : 150);

    return () => clearTimeout(t);
  }, [
    currentStep,
    isActive,
    setCurrentScreen,
    setSelectedPipelineJobId,
    setTourForcedTab,
    setTourForcedDept,
    setTourForcedJobId,
    setSelectedFeedbackAppId,
    jobs,
    applications,
    setIsMobileMoreOpen,
  ]);

  // Measure active target's coordinates and perform scroll preservation
  const measureTarget = useCallback(() => {
    if (!currentStepData || !isActive) return;

    const isMobile = window.innerWidth < 768;
    let targetSelector = currentStepData.selector;

    // Resolve selector for mobile viewports
    if (isMobile) {
      if (targetSelector === "#sidebar-dashboard") {
        targetSelector = "#mobile-nav-dashboard";
      } else if (targetSelector === "#sidebar-jobs") {
        targetSelector = "#mobile-nav-jobs";
      } else if (targetSelector === "#sidebar-candidates") {
        targetSelector = "#mobile-nav-candidates";
      } else if (targetSelector === "#sidebar-pipeline") {
        targetSelector = "#mobile-nav-pipeline";
      } else if (targetSelector === "#sidebar-feedback") {
        targetSelector = "#mobile-more-feedback";
      } else if (targetSelector === "#sidebar-ai-generator") {
        targetSelector = "#mobile-more-ai-generator";
      } else if (targetSelector === "#sidebar-email-dispenser") {
        targetSelector = "#mobile-more-email-dispenser";
      } else if (targetSelector === "#btn-add-job") {
        targetSelector = "#btn-add-job-mobile";
      }
    }

    // Resolve target element safely using the selector
    let el = document.querySelector(targetSelector) as HTMLElement | null;

    // Graceful fallback for candidate cards or missing content
    if (!el && currentStepData.selector === ".pipeline-card") {
      el = document.querySelector("#pipeline-columns-container") as HTMLElement | null;
    }

    if (!el) {
      setTargetRect(null);
      return;
    }

    // Scroll handling: Avoid unnecessary jumps, especially for fixed navigation or overlays
    const style = window.getComputedStyle(el);
    const isFixed = style.position === "fixed" || el.closest(".fixed") !== null;

    if (isFixed) {
      // Fixed elements on mobile or desktop do not need page scrolls to prevent screen shaking
    } else {
      const isSidebarElement = currentStepData.selector.startsWith("#sidebar-") && !isMobile;
      if (isSidebarElement) {
        // Sidebar steps should only scroll the sidebar container if truncated, keeping the viewport static
        const sidebarContainer = document.querySelector("aside");
        if (sidebarContainer) {
          const itemTop = el.offsetTop;
          const containerHeight = sidebarContainer.clientHeight;
          if (itemTop > containerHeight - 120) {
            sidebarContainer.scrollTop = itemTop - 80;
          }
        }
      } else {
        // Standard page scroll: scroll smoothly into view keeping focus context clean
        el.scrollIntoView({ behavior: "smooth", block: "nearest" });
      }
    }

    // Calculate actual rect for the spot light cutout
    const rect = el.getBoundingClientRect();
    setTargetRect(rect);
  }, [currentStepData, isActive]);

  // Keep coordinates updated in sync with DOM measurements
  useEffect(() => {
    measureTarget();
  }, [measureTarget, currentVibe]);

  // Recalculate coordinates on window changes/scrolling events (Section 6)
  useEffect(() => {
    if (!isActive) return;

    const handleUpdate = () => {
      measureTarget();
    };

    window.addEventListener("resize", handleUpdate);
    window.addEventListener("scroll", handleUpdate, true); // listen for scrolled tables/containers
    window.addEventListener("orientationchange", handleUpdate);

    return () => {
      window.removeEventListener("resize", handleUpdate);
      window.removeEventListener("scroll", handleUpdate, true);
      window.removeEventListener("orientationchange", handleUpdate);
    };
  }, [isActive, measureTarget]);

  // Recalculate tooltip position overlay based on target rectangle and viewport bounds
  useEffect(() => {
    if (!targetRect || !currentStepData) return;

    const gap = 12;

    // Viewport boundaries (with safe margin)
    const vw = window.innerWidth;
    const vh = window.innerHeight;
    const padding = 16;

    // Responsive Max-Width configs: Desktop 320, Tablet 280, Mobile 240
    const tooltipWidth = vw >= 1024 ? 320 : vw >= 768 ? 280 : 240;

    // Use actual rendered size if available, fallback to estimated 160
    const tooltipHeight = tooltipRef.current?.offsetHeight || 160;

    let computedPlacement = currentStepData.placement || "bottom";

    // Override placement to "top" on mobile bottom navigation targets to avoid colliding with offscreen bottom bounds
    const isMobile = vw < 768;
    if (isMobile && currentStepData.selector.startsWith("#sidebar-")) {
      computedPlacement = "top";
    }

    let top = 0;
    let left = 0;

    // Calculate ideal coordinates
    if (computedPlacement === "right") {
      top = targetRect.top + (targetRect.height - tooltipHeight) / 2;
      left = targetRect.right + gap;
    } else if (computedPlacement === "left") {
      top = targetRect.top + (targetRect.height - tooltipHeight) / 2;
      left = targetRect.left - tooltipWidth - gap;
    } else if (computedPlacement === "top") {
      top = targetRect.top - tooltipHeight - gap;
      left = targetRect.left + (targetRect.width - tooltipWidth) / 2;
    } else {
      // Bottom (Default)
      top = targetRect.bottom + gap;
      left = targetRect.left + (targetRect.width - tooltipWidth) / 2;
    }

    // --- COLLISION RESOLUTION (Section 6) ---
    // If the tooltip would slide off the left/right window padding, clamp horizontally
    if (left < padding) {
      left = padding;
    } else if (left + tooltipWidth > vw - padding) {
      left = vw - tooltipWidth - padding;
    }

    // Check vertical collisions, automatic repositioning flip:
    if (computedPlacement === "bottom" && top + tooltipHeight > vh - padding) {
      // Flip to Top if it fits
      if (targetRect.top - tooltipHeight - gap > padding) {
        computedPlacement = "top";
        top = targetRect.top - tooltipHeight - gap;
      } else {
        // Clamp it
        top = vh - tooltipHeight - padding;
      }
    } else if (computedPlacement === "top" && top < padding) {
      // Flip to Bottom if it fits
      if (targetRect.bottom + gap + tooltipHeight < vh - padding) {
        computedPlacement = "bottom";
        top = targetRect.bottom + gap;
      } else {
        // Clamp it
        top = padding;
      }
    } else if (computedPlacement === "right" && left + tooltipWidth > vw - padding) {
      // Flip to Left if it fits
      if (targetRect.left - tooltipWidth - gap > padding) {
        computedPlacement = "left";
        left = targetRect.left - tooltipWidth - gap;
      } else {
        left = vw - tooltipWidth - padding;
      }
    } else if (computedPlacement === "left" && left < padding) {
      // Flip to Right if it fits
      if (targetRect.right + gap + tooltipWidth < vw - padding) {
        computedPlacement = "right";
        left = targetRect.right + gap;
      } else {
        left = padding;
      }
    }

    // Clamp vertical top securely
    if (top < padding) {
      top = padding;
    } else if (top + tooltipHeight > vh - padding) {
      top = vh - tooltipHeight - padding;
    }

    setPlacement(computedPlacement);
    setCoords({ top, left });
  }, [targetRect, currentStep, currentStepData]);

  if (!isActive || !currentStepData) return null;

  const totalSteps = tourSteps.length;

  const handleNext = () => {
    if (currentStep < totalSteps - 1) {
      setStep(currentStep + 1);
    } else {
      onClose();
    }
  };

  const handlePrev = () => {
    if (currentStep > 0) {
      setStep(currentStep - 1);
    }
  };

  const handleSkip = () => {
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden pointer-events-none select-none">
      
      {/* Dynamic spot light overlay backdrops */}
      {targetRect && (
        <React.Fragment>
          {/* Box Shadow Spotlight Ring around the target */}
          <div
            className="fixed pointer-events-none border border-[#52B788] ring-4 ring-[#52B788]/20 transition-all duration-300 shadow-[0_0_0_9999px_rgba(15,31,24,0.48)] z-40 rounded-xl"
            style={{
              top: targetRect.top - 4,
              left: targetRect.left - 4,
              width: targetRect.width + 8,
              height: targetRect.height + 8,
            }}
          />
          {/* Prevent user interaction underneath highlighted hotspot if required */}
          <div
            className="fixed pointer-events-auto z-45"
            style={{
              top: targetRect.top,
              left: targetRect.left,
              width: targetRect.width,
              height: targetRect.height,
            }}
          />
        </React.Fragment>
      )}

      {/* Floating Tooltip dialogue panel */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentStep}
          ref={tooltipRef}
          initial={{ opacity: 0, scale: 0.95, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: -10 }}
          transition={{ duration: 0.25 }}
          className="fixed pointer-events-auto bg-white border border-[#D8F3DC] rounded-2xl shadow-2xl p-5 z-50 flex flex-col justify-between"
          style={{
            top: coords.top,
            left: coords.left,
            width: window.innerWidth >= 1024 ? 320 : window.innerWidth >= 768 ? 280 : 240,
          }}
        >
          {/* Tooltip Arrow indicator pointer */}
          {targetRect && (
            <div
              className={`absolute w-3 h-3 bg-white border-t border-l border-[#D8F3DC] rotate-45 transform transition-all duration-150 ${
                placement === "bottom"
                  ? "-top-1.5 left-1/2 -translate-x-1/2"
                  : placement === "top"
                  ? "-bottom-1.5 left-1/2 -translate-x-1/2 border-t-0 border-l-0 border-b border-r"
                  : placement === "right"
                  ? "-left-1.5 top-1/2 -translate-y-1/2 border-t-0 border-l border-b"
                  : "-right-1.5 top-1/2 -translate-y-1/2 border-l-0 border-t border-r"
              }`}
            />
          )}

          {/* Header */}
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-[#52B788] inline-block animate-pulse" />
              <h5 className="text-xs font-black tracking-wider text-[#2D6A4F] uppercase font-sans">
                {currentStepData.title}
              </h5>
            </div>
            <button
              onClick={handleSkip}
              className="p-1 hover:bg-gray-50 rounded-lg text-gray-400 hover:text-gray-600 transition-colors cursor-pointer"
              title="Skip onboarding"
            >
              <X size={15} />
            </button>
          </div>

          {/* Description body context */}
          <div className="space-y-3 flex-grow mb-4">
            <p className="text-xs text-gray-700 leading-relaxed font-sans select-text">
              {currentStepData.content}
            </p>
            {/* Step progress count indicator */}
            <div className="flex items-center gap-1">
              <span className="text-[10px] font-mono font-bold text-[#52B788] bg-[#F0FAF4] px-1.5 py-0.5 rounded border border-[#D8F3DC]">
                Tour Step {currentStep + 1} of {totalSteps}
              </span>
            </div>
          </div>

          {/* Footer Navigation Bar */}
          <div className="flex items-center justify-between pt-3 border-t border-gray-100 flex-shrink-0">
            {/* Skip Option button */}
            <button
              onClick={handleSkip}
              className="text-[10px] font-bold text-gray-400 hover:text-gray-600 uppercase tracking-wider cursor-pointer"
            >
              Skip
            </button>

            {/* Back, Next buttons */}
            <div className="flex items-center gap-2">
              {currentStep > 0 && (
                <button
                  onClick={handlePrev}
                  className="p-1.5 rounded-lg border border-gray-200 hover:bg-gray-50 text-gray-650 transition-colors cursor-pointer h-8 w-8 flex items-center justify-center"
                  title="Previous Step"
                >
                  <ChevronLeft size={16} />
                </button>
              )}

              <button
                onClick={handleNext}
                className="py-1.5 px-3 rounded-lg bg-[#2D6A4F] hover:bg-[#1A3A2E] text-white text-[10px] font-bold uppercase tracking-wider transition-all cursor-pointer h-8 flex items-center justify-center gap-1 shadow-sm"
              >
                {currentStep === totalSteps - 1 ? (
                  <span>Finish</span>
                ) : (
                  <>
                    <span>Next</span>
                    <ChevronRight size={14} />
                  </>
                )}
              </button>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
};
