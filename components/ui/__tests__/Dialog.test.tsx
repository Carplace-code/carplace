// components/__tests__/Dialog.test.tsx
import { render } from "@testing-library/react";

import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../dialog";

describe("Dialog", () => {
  it("matches snapshot", () => {
    const { container } = render(
      <Dialog>
        <DialogTrigger>
          <button type="button">Open Dialog</button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Example Title</DialogTitle>
            <DialogDescription>Example description.</DialogDescription>
          </DialogHeader>
          <div>Dialog body content</div>
          <DialogFooter>
            <DialogClose>
              <button type="button">Close</button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>,
    );

    expect(container).toMatchSnapshot();
  });
});
