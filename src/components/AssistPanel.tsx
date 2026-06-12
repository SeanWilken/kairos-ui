import { ReactElement } from 'react';

export interface AssistButtonProps {
    icon: React.ElementType
    label: string
    action: () => {}
}

export interface AssistPanelProps {
    icon: React.ElementType
    panelTitle: string
    panelControls: AssistButtonProps[]
}


function AssistButton({ icon: Icon, label, action }: AssistButtonProps) {
  return (
    <button className="w-full flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-neutral-50 transition-colors text-left group"
        onClick={action}
    >
      <Icon className="w-4 h-4 text-neutral-400 group-hover:text-neutral-600" />
      <span className="text-sm text-neutral-700">{label}</span>
    </button>
  );
}

export default function AssistPanel({icon: Icon, panelTitle, panelControls}: AssistPanelProps) {
  return (
    <div className="absolute top-6 right-6 bg-white rounded-xl shadow-lg border border-neutral-200 p-4 w-64">
      <div className="flex items-center gap-2 mb-4">
        <Icon className="w-4 h-4 text-purple-500" />
        <span className="font-medium text-sm text-neutral-900">{panelTitle}</span>
      </div>

      <div className="space-y-2">
        {   panelControls.map((assistBttnProps: AssistButtonProps) => { 
                return (
                    AssistButton(assistBttnProps)
                )
            })
        }
      </div>
    </div>
  );
}

