import * as React from "react";
import type { JSX } from "react";
import {
  Card as FluentCard,
  CardHeader,
  CardFooter,
  CardPreview,
} from "@fluentui/react-components";

export const Card = ({
  title,
  text,
  children,
  actions,
}: {
  title: string;
  text?: string;
  children?: React.ReactNode;
  actions?: JSX.Element;
}): JSX.Element => (
  <FluentCard>
    <CardHeader header={<span>{title}</span>} />
    <CardPreview>{children ?? text}</CardPreview>
    {actions && <CardFooter>{actions}</CardFooter>}
  </FluentCard>
);
