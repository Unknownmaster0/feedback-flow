import React from "react";
import {
  Body,
  Container,
  Head,
  Heading,
  Html,
  Preview,
  Text,
} from "@react-email/components";

export interface emailInterfaceProps {
  userName: string;
  otp: string;
}

export const VerificationEmail = ({ userName, otp }: emailInterfaceProps) => {
  return (
    <Html lang="en">
      <Head>
        <title>Hii {userName}</title>
        <br />
      </Head>
      <Body style={bodyStyle}>
        <Container style={containerStyle}>
          <div>
            <Preview
              style={{
                display: "block",
              }}
            >
              Welcome to Feedback app
            </Preview>
            <Text>
              Thank you <strong>{userName}</strong> for joining our waitlist and
              for your patience. We will send you a note when we have something
              new to share.
              <div>
                Your verification code to signup:
                <h1 style={{ backgroundColor: "red", display: "inline" }}>
                  {otp}
                </h1>
              </div>
            </Text>
          </div>
        </Container>
      </Body>
    </Html>
  );
};

export const containerStyle = {
  fontWeight: "500",
  fontSize: "small",
};

export const bodyStyle = {
  backgroundColor: "#BAC4C8",
};
