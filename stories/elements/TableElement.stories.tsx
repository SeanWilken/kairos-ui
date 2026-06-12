import type { Meta, StoryObj } from "@storybook/react";
import {
  ScrollArea,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../src";

const meta = {
  title: "Elements/Display/Table",
  component: Table,
  subcomponents: {
    TableHeader,
    TableBody,
    TableRow,
    TableHead,
    TableCell,
  },
  tags: ["autodocs"],
  argTypes: {
    className: { control: "text", description: "Custom className for table root." },
  },
  parameters: {
    docs: {
      description: {
        component: "Composable table primitives for rows/cells/headers. Pair with `ScrollArea` for overflow in dense data views.",
      },
    },
  },
} satisfies Meta<typeof Table>;

export default meta;
type Story = StoryObj<typeof meta>;

export const DataTable: Story = {
  render: () => (
    <div className="max-w-2xl p-6">
      <ScrollArea className="h-56 rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Item</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Owner</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow>
              <TableCell>Release notes</TableCell>
              <TableCell>Ready</TableCell>
              <TableCell>Alex</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>Decision log</TableCell>
              <TableCell>Review</TableCell>
              <TableCell>Jordan</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>Action tracker</TableCell>
              <TableCell>In progress</TableCell>
              <TableCell>Riley</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </ScrollArea>
    </div>
  ),
};
