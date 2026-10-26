/** @vitest-environment jsdom */
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import messages from "@/messages/de.json";
import {
  CopyInviteLinkClient,
  GroupDetailProvider,
} from "./copy-invite-link-client";

describe("CopyInviteLinkClient", () => {
  it("reports failure when the legacy clipboard command fails", async () => {
    Object.defineProperty(navigator, "clipboard", {
      configurable: true,
      value: undefined,
    });
    Object.defineProperty(document, "execCommand", {
      configurable: true,
      value: vi.fn(() => false),
    });
    render(
      <GroupDetailProvider messages={messages}>
        <CopyInviteLinkClient inviteUrl="https://example.com/invite" />
      </GroupDetailProvider>,
    );

    fireEvent.click(screen.getByRole("button"));

    await waitFor(() =>
      expect(screen.getByRole("alert").textContent ?? "").toContain(
        "Kopieren fehlgeschlagen",
      ),
    );
    expect(screen.getByRole("alert").textContent ?? "").toContain(
      "https://example.com/invite",
    );
  });
});
