import {
  Body,
  Button,
  Container,
  Head,
  Html,
  Link,
  Preview,
  Section,
  Tailwind,
  Text,
} from "@react-email/components";

interface ForgotPasswordEmailProps {
  username: string;
  resetUrl: string;
  userEmail: string;
}

const ForgotPasswordEmail = ({
  username,
  resetUrl,
  userEmail,
}: ForgotPasswordEmailProps) => {
  return (
    <Html dir="ltr" lang="en">
      <Tailwind>
        <Head />
        <Preview>Reset your Bloom password</Preview>
        <Body className="bg-[#F9F6F0] py-[40px] font-sans">
          <Container className="mx-auto max-w-[600px] rounded-[16px] bg-white overflow-hidden border border-[#E5DCD3]">
            <Section className="h-[4px] bg-[#D96A4E]" />
            <Section className="p-[40px]">
              <Text className="mt-0 mb-[8px] font-bold text-[22px] text-[#2A2F2D] tracking-tight">
                Reset your password
              </Text>
              <Text className="mt-0 mb-[24px] text-[15px] text-[#5C6B64] leading-[24px]">
                Hi {username}, we received a request to reset the password for
                your Bloom account associated with{" "}
                <strong className="text-[#2A2F2D]">{userEmail}</strong>. Click
                the button below to create a new password.
              </Text>

              <Section className="mb-[32px] text-center">
                <Button
                  className="box-border rounded-[8px] bg-[#D96A4E] px-[32px] py-[14px] font-semibold text-[15px] text-white no-underline"
                  href={resetUrl}
                >
                  Reset Password
                </Button>
              </Section>

              <Text className="mt-0 mb-[8px] text-[13px] text-[#5C6B64] leading-[20px]">
                If the button doesn&apos;t work, copy and paste this link into
                your browser:
              </Text>
              <Link
                className="break-all text-[13px] text-[#D96A4E] leading-[20px]"
                href={resetUrl}
              >
                {resetUrl}
              </Link>

              <Section className="mt-[24px] mb-[24px] rounded-[8px] bg-[#F9F6F0] p-[20px]">
                <Text className="m-0 mb-[6px] font-semibold text-[13px] text-[#2A2F2D]">
                  Didn&apos;t request this?
                </Text>
                <Text className="m-0 text-[13px] text-[#5C6B64] leading-[20px]">
                  If you didn&apos;t ask to reset your password, you can safely
                  ignore this email. Your account is unchanged. This link
                  expires in 24 hours.
                </Text>
              </Section>

              <Text className="m-0 text-[12px] text-[#5C6B64] leading-[18px]">
                The Bloom team
              </Text>
            </Section>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
};

export default ForgotPasswordEmail;
