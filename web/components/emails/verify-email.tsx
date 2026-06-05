import {
  Body,
  Button,
  Container,
  Head,
  Hr,
  Html,
  Preview,
  Section,
  Tailwind,
  Text,
} from "@react-email/components";

interface VerifyEmailProps {
  username: string;
  verifyUrl: string;
}

const VerifyEmail = ({ username, verifyUrl }: VerifyEmailProps) => {
  return (
    <Html dir="ltr" lang="en">
      <Tailwind>
        <Head />
        <Preview>Verify your email to start using Bloom</Preview>
        <Body className="bg-[#F9F6F0] py-[40px] font-sans">
          <Container className="mx-auto max-w-[600px] rounded-[16px] bg-white overflow-hidden border border-[#E5DCD3]">
            <Section className="h-[4px] bg-[#D96A4E]" />
            <Section className="p-[40px]">
              <Text className="mt-0 mb-[8px] font-bold text-[22px] text-[#2A2F2D] tracking-tight">
                Verify your email address
              </Text>
              <Text className="mt-0 mb-[24px] text-[15px] text-[#5C6B64] leading-[24px]">
                Hi {username}, welcome to Bloom. Click the button below to
                verify your email and activate your account.
              </Text>

              <Section className="mb-[32px] text-center">
                <Button
                  className="box-border rounded-[8px] bg-[#D96A4E] px-[32px] py-[14px] font-semibold text-[15px] text-white no-underline"
                  href={verifyUrl}
                >
                  Verify Email Address
                </Button>
              </Section>

              <Text className="mt-0 mb-[8px] text-[13px] text-[#5C6B64] leading-[20px]">
                If the button doesn&apos;t work, copy and paste this link into
                your browser:
              </Text>
              <Text className="mt-0 mb-[32px] text-[13px] text-[#D96A4E] leading-[20px] break-all">
                {verifyUrl}
              </Text>

              <Text className="mt-0 mb-[24px] text-[13px] text-[#5C6B64] leading-[20px]">
                This link expires in 24 hours. If you didn&apos;t create a Bloom
                account, you can safely ignore this email.
              </Text>

              <Hr className="my-[24px] border-[#E5DCD3]" />

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

export default VerifyEmail;
