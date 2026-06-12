import { useState } from "react"
import { Target, Lightbulb, HelpCircle } from "lucide-react";

export interface UnderstandingInsightProps {
  problem: string;
  assumptions: string[];
  questions: string[];
  nextStep: string;
}

export function UnderstandingInsights({
  problem = 'Designing an AI-readable knowledge index.',
  assumptions = [
    'Agents should not receive raw data by default',
    'Sources should be described before being searched',
    'Humans define important relationships'
  ],
  questions = [
    'How should access rules be represented?',
    'How should relationships be weighted?',
    'How much summary is enough?'
  ],
  nextStep = 'Define the node schema for a knowledge source.',
}: UnderstandingInsightProps) {
  return (
      <div className="w-96 bg-neutral-50 border-l border-neutral-200 flex flex-col">
        <div className="h-16 border-b border-neutral-100 px-6 flex items-center bg-white">
          <span className="font-medium text-neutral-900">Understanding Insights</span>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <Target className="w-4 h-4 text-blue-500" />
              <span className="text-xs font-medium text-neutral-400 uppercase tracking-wide">
                Current Problem
              </span>
            </div>
            <p className="text-sm text-neutral-900 bg-white p-4 rounded-lg border border-neutral-200">
              {problem}
            </p>
          </div>

          <div>
            <div className="flex items-center gap-2 mb-3">
              <Lightbulb className="w-4 h-4 text-amber-500" />
              <span className="text-xs font-medium text-neutral-400 uppercase tracking-wide">
                Assumptions
              </span>
            </div>
            <div className="space-y-2">
              {assumptions.map((assumption, idx) => (
                <div
                  key={idx}
                  className="text-sm text-neutral-700 bg-white p-3 rounded-lg border border-neutral-200 pl-4 border-l-2 border-l-amber-300"
                >
                  {assumption}
                </div>
              ))}
            </div>
          </div>

          <div>
            <div className="flex items-center gap-2 mb-3">
              <HelpCircle className="w-4 h-4 text-purple-500" />
              <span className="text-xs font-medium text-neutral-400 uppercase tracking-wide">
                Open Questions
              </span>
            </div>
            <div className="space-y-2">
              {questions.map((question, idx) => (
                <div
                  key={idx}
                  className="text-sm text-neutral-700 bg-white p-3 rounded-lg border border-neutral-200 pl-4 border-l-2 border-l-purple-300"
                >
                  {question}
                </div>
              ))}
            </div>
          </div>

          <div>
            <div className="flex items-center gap-2 mb-3">
              <Target className="w-4 h-4 text-green-500" />
              <span className="text-xs font-medium text-neutral-400 uppercase tracking-wide">
                Potential Next Step
              </span>
            </div>
            <p className="text-sm text-neutral-900 bg-gradient-to-br from-green-50 to-emerald-50 p-4 rounded-lg border-2 border-green-200 font-medium">
              {nextStep}
            </p>
          </div>
        </div>
      </div>
  );
}

export const UnderstandingInsightMenu = UnderstandingInsights;
