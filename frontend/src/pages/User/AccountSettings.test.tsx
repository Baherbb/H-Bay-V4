import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import AccountSettings from "./AccountSettings";

describe("AccountSettings Component - Hossam Amir's Tests", () => {
  beforeEach(() => {
    render(<AccountSettings />);
  });

  test("renders the component correctly", () => {
    expect(screen.getByText(/Account Settings/i)).toBeInTheDocument();
    expect(screen.getByText(/Manage your account preferences and security/i)).toBeInTheDocument();
  });

  test("updates email successfully", () => {
    const emailInput = screen.getByDisplayValue("hossam.amir@example.com");
    const updateButton = screen.getAllByText("Update")[0];

    fireEvent.change(emailInput, { target: { value: "new.hossam.amir@example.com" } });
    fireEvent.click(updateButton);

    expect(screen.getByText(/Email updated successfully!/i)).toBeInTheDocument();
    expect(emailInput).toHaveValue("new.hossam.amir@example.com");
  });

  test("updates phone number successfully", () => {
    const phoneInput = screen.getByDisplayValue("+201234567890");
    const updateButton = screen.getAllByText("Update")[1];

    fireEvent.change(phoneInput, { target: { value: "+201112223333" } });
    fireEvent.click(updateButton);

    expect(screen.getByText(/Phone number updated successfully!/i)).toBeInTheDocument();
    expect(phoneInput).toHaveValue("+201112223333");
  });

  test("displays error if password fields are empty", () => {
    const updatePasswordButton = screen.getByText("Update Password");

    fireEvent.click(updatePasswordButton);

    expect(screen.getByText(/Please fill out all password fields./i)).toBeInTheDocument();
  });

  test("displays error if new password and confirm password do not match", () => {
    const currentPasswordInput = screen.getByPlaceholderText("Current Password");
    const newPasswordInput = screen.getByPlaceholderText("New Password");
    const confirmPasswordInput = screen.getByPlaceholderText("Confirm Password");
    const updatePasswordButton = screen.getByText("Update Password");

    fireEvent.change(currentPasswordInput, { target: { value: "oldpassword" } });
    fireEvent.change(newPasswordInput, { target: { value: "newpassword123" } });
    fireEvent.change(confirmPasswordInput, { target: { value: "differentpassword" } });

    fireEvent.click(updatePasswordButton);

    expect(screen.getByText(/New Password and Confirm Password do not match./i)).toBeInTheDocument();
  });

  test("updates password successfully", () => {
    const currentPasswordInput = screen.getByPlaceholderText("Current Password");
    const newPasswordInput = screen.getByPlaceholderText("New Password");
    const confirmPasswordInput = screen.getByPlaceholderText("Confirm Password");
    const updatePasswordButton = screen.getByText("Update Password");

    fireEvent.change(currentPasswordInput, { target: { value: "oldpassword" } });
    fireEvent.change(newPasswordInput, { target: { value: "newpassword123" } });
    fireEvent.change(confirmPasswordInput, { target: { value: "newpassword123" } });

    fireEvent.click(updatePasswordButton);

    expect(screen.getByText(/Password updated successfully!/i)).toBeInTheDocument();
    expect(currentPasswordInput).toHaveValue("");
    expect(newPasswordInput).toHaveValue("");
    expect(confirmPasswordInput).toHaveValue("");
  });
});
