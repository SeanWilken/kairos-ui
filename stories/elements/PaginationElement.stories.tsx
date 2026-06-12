import type { Meta, StoryObj } from "@storybook/react";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "../../src";

const meta = {
  title: "Elements/Navigation/Pagination",
  component: Pagination,
  subcomponents: {
    PaginationLink,
    PaginationPrevious,
    PaginationNext,
  },
  tags: ["autodocs"],
  argTypes: {
    className: { control: "text", description: "Custom className for pagination nav root." },
  },
  parameters: {
    docs: {
      description: {
        component: "Navigation pagination primitives. Use `PaginationLink`, `PaginationPrevious`, and `PaginationNext` to compose page controls.",
      },
    },
  },
} satisfies Meta<typeof Pagination>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <div className="p-6">
      <Pagination>
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious href="#" />
          </PaginationItem>
          <PaginationItem>
            <PaginationLink href="#" isActive>
              1
            </PaginationLink>
          </PaginationItem>
          <PaginationItem>
            <PaginationLink href="#">2</PaginationLink>
          </PaginationItem>
          <PaginationItem>
            <PaginationNext href="#" />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </div>
  ),
};
