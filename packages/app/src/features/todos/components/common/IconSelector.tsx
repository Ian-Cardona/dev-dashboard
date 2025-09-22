import {
  DocumentTextIcon,
  WrenchScrewdriverIcon,
  ChatBubbleLeftRightIcon,
  BugAntIcon,
  XMarkIcon,
  QuestionMarkCircleIcon,
  FireIcon,
  CheckCircleIcon,
} from '@heroicons/react/24/outline';

interface IconSelectorProps {
  type: string;
}

const IconSelector = ({ type }: IconSelectorProps) => {
  switch (type) {
    case 'TODO':
      return (
        <CheckCircleIcon className="h-5 w-5 flex-shrink-0" aria-hidden="true" />
      );
    case 'FIXME':
      return <FireIcon className="h-5 w-5 flex-shrink-0" aria-hidden="true" />;
    case 'HACK':
      return (
        <WrenchScrewdriverIcon
          className="h-5 w-5 flex-shrink-0"
          aria-hidden="true"
        />
      );
    case 'NOTE':
      return (
        <ChatBubbleLeftRightIcon
          className="h-5 w-5 flex-shrink-0"
          aria-hidden="true"
        />
      );
    case 'BUG':
      return (
        <BugAntIcon className="h-5 w-5 flex-shrink-0" aria-hidden="true" />
      );
    case 'XXX':
      return <XMarkIcon className="h-5 w-5 flex-shrink-0" aria-hidden="true" />;
    case 'OTHER':
      return (
        <QuestionMarkCircleIcon
          className="h-5 w-5 flex-shrink-0"
          aria-hidden="true"
        />
      );
    default:
      return (
        <DocumentTextIcon
          className="h-5 w-5 flex-shrink-0"
          aria-hidden="true"
        />
      );
  }
};

export default IconSelector;
