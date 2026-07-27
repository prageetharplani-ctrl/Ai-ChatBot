import { ChatView } from '@/components/ChatView';

export default function ChatPage({ params }: { params: { id: string } }) {
  return <ChatView conversationId={params.id} />;
}
