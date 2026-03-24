import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";
import { LucideIcon } from "lucide-react";
import Link from "next/link";
import { Button } from "./ui/button";

interface EmptyStateProps {
  Icon: LucideIcon;
  title: string;
  description: string;
  btnHref: string;
  btnText: string;
}

const EmptyState = ({
  Icon,
  title,
  description,
  btnHref,
  btnText,
}: EmptyStateProps) => {
  return (
    <Empty className="h-full border">
      <EmptyHeader>
        <EmptyMedia variant="icon">
          <Icon />
        </EmptyMedia>
        <EmptyTitle>{title}</EmptyTitle>
        <EmptyDescription>{description}</EmptyDescription>
      </EmptyHeader>
      <EmptyContent>
        <Button>
          <Link href={btnHref}>{btnText}</Link>
        </Button>
      </EmptyContent>
    </Empty>
  );
};

export default EmptyState;
