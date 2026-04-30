"use client";

import { BoardProvider } from "@/lib/board-context";
import { useParams } from "next/navigation";

export default function BoardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const params = useParams();
  const boardId = params.boardId as string;

  return (
    <BoardProvider boardId={boardId}>
      {children}
    </BoardProvider>
  );
}
