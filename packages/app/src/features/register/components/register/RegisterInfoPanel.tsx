import FeatureNode from './FeatureNode';
import {
  CheckCircleIcon,
  CloudArrowUpIcon,
  CodeBracketIcon,
} from '@heroicons/react/24/outline';

const RegisterInfoPanel = () => {
  const features = [
    {
      icon: CodeBracketIcon,
      title: 'VS Code Integration',
      subtitle:
        'Install the DevDashboard extension from the VS Code Marketplace to connect your editor to the dashboard.',
    },
    {
      icon: CheckCircleIcon,
      title: 'Task Management',
      subtitle:
        'Sync Todos and activity from the extension, track completions, and view your history and analytics in DevDashboard.',
    },
    {
      icon: CloudArrowUpIcon,
      title: 'Deployment Monitoring',
      subtitle:
        'Link AWS, GitHub, and Netlify for lightweight deployment and project status monitoring.',
    },
  ];

  return (
    <div className="flex-1 overflow-auto rounded-b-4xl">
      <div className="flex min-h-full items-center justify-center p-8">
        <div className="w-full max-w-2xl">
          <div className="mb-12 text-center">
            <h1 className="mb-3 text-4xl font-bold text-[var(--color-fg)]">
              DevDashboard
            </h1>
            <p className="text-lg text-[var(--color-accent)]">
              Your full‑stack development dashboard
            </p>
          </div>

          <div className="space-y-6">
            {features.map((feature, index) => (
              <FeatureNode
                key={feature.title}
                icon={feature.icon}
                title={feature.title}
                subtitle={feature.subtitle}
                delay={index * 0.1}
              />
            ))}
          </div>

          <div className="mt-12 border-t pt-8 text-center">
            <p className="text-sm text-[var(--color-accent)]">
              Everything you need for your developer workflow—focused,
              centralized, and quick.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterInfoPanel;
