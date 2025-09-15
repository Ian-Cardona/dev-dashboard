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
import React from 'react';

interface IconSelectorProps {
  type: string;
}

const IconSelector: React.FC<IconSelectorProps> = ({ type }) => {
  switch (type) {
    case 'TODO':
      return (
        <CheckCircleIcon
          className="h-5 w-5 inline-block mr-2"
          aria-hidden="true"
        />
      );
    case 'FIXME':
      return (
        <FireIcon className="h-5 w-5 inline-block mr-2" aria-hidden="true" />
      );
    case 'HACK':
      return (
        <WrenchScrewdriverIcon
          className="h-5 w-5 inline-block mr-2"
          aria-hidden="true"
        />
      );
    case 'NOTE':
      return (
        <ChatBubbleLeftRightIcon
          className="h-5 w-5 inline-block mr-2"
          aria-hidden="true"
        />
      );
    case 'BUG':
      return (
        <BugAntIcon className="h-5 w-5 inline-block mr-2" aria-hidden="true" />
      );
    case 'XXX':
      return (
        <XMarkIcon className="h-5 w-5 inline-block mr-2" aria-hidden="true" />
      );
    case 'OTHER':
      return (
        <QuestionMarkCircleIcon
          className="h-5 w-5 inline-block mr-2"
          aria-hidden="true"
        />
      );
    default:
      return (
        <DocumentTextIcon
          className="h-5 w-5 inline-block mr-2"
          aria-hidden="true"
        />
      );
  }
};

export default IconSelector;
