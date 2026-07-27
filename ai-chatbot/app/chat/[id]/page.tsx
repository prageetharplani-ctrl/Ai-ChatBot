import { ChatView } from '@/components/ChatView';

type Props = {
  params: Promise<{
    id: string;
  }>;
};

export default async function ChatPage({ params }: Props) {
  const { id } = await params;

  return <ChatView conversationId={id} />;
}