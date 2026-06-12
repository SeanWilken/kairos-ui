import type { Meta, StoryObj } from "@storybook/react";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "../../src";

const meta = {
  title: "Elements/Navigation/Breadcrumb",
  component: Breadcrumb,
  subcomponents: {
    BreadcrumbLink,
    BreadcrumbPage,
  },
  tags: ["autodocs"],
  argTypes: {
    className: { control: "text", description: "Custom className for breadcrumb nav root." },
  },
  parameters: {
    docs: {
      description: {
        component: "Breadcrumb composition primitives. Use `BreadcrumbLink` for navigable steps and `BreadcrumbPage` for the current location.",
      },
    },
  },
} satisfies Meta<typeof Breadcrumb>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: (args) => (
    <Breadcrumb {...args}>
      <BreadcrumbList>
        <BreadcrumbItem><BreadcrumbLink href="#">Workspaces</BreadcrumbLink></BreadcrumbItem>
        <BreadcrumbSeparator />
        <BreadcrumbItem><BreadcrumbPage>Thread Center</BreadcrumbPage></BreadcrumbItem>
      </BreadcrumbList>
    </Breadcrumb>
  ),
};
