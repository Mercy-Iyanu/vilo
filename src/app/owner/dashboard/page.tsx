"use client";

import {
  HStack,
  Button,
  Dialog,
  Input,
  Portal,
  Stack,
  Text,
  Box,
} from "@chakra-ui/react";
import Image from "next/image";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function OwnerDashboardPage() {
  const [eventUrl, setEventUrl] = useState("");
  const [qrCode, setQrCode] = useState("");
  const [eventId, setEventId] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleCreateEvent = async () => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/events", {
        method: "POST",
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to create event");

      setEventUrl(data.eventUrl);
      setQrCode(data.qrCodeDataURL);
      setEventId(data.eventId);
    } catch (err) {
      alert(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  console.log("eventId:", eventId);

  const handleCopy = () => {
    navigator.clipboard.writeText(eventUrl);
    alert("Event link copied to clipboard!");
  };

  const handleDownload = () => {
    const a = document.createElement("a");
    a.href = qrCode;
    a.download = "event-qr.png";
    a.click();
  };

  return (
    <div>
      Owner Dashboard Page
      <HStack gap="4" mt="4">
        <Dialog.Root>
          <Dialog.Trigger asChild>
            <Button colorPalette="teal" variant="solid">
              Create Event
            </Button>
          </Dialog.Trigger>
          <Portal>
            <Dialog.Backdrop />

            <Dialog.Positioner>
              <Dialog.Content borderRadius="lg" p="6" maxW="sm">
                {!eventUrl ? (
                  <>
                    <Dialog.Header>
                      <Dialog.Title fontSize="xl" fontWeight="bold">
                        Create Event
                      </Dialog.Title>
                    </Dialog.Header>

                    <Dialog.Body>
                      <Text mb="4" color="gray.600" textAlign="center">
                        Generate your event link + QR
                      </Text>
                    </Dialog.Body>

                    <Dialog.Footer justifyContent="center">
                      <Button
                        colorPalette="teal"
                        isLoading={isLoading}
                        onClick={handleCreateEvent}
                      >
                        Create Event
                      </Button>
                    </Dialog.Footer>
                  </>
                ) : (
                  <>
                    <Dialog.Header textAlign="center">
                      <Dialog.Title fontSize="xl" fontWeight="bold">
                        Event Ready 🎉
                      </Dialog.Title>
                      <Text fontSize="sm" color="gray.600">
                        Share the link or QR code with your guests
                      </Text>
                    </Dialog.Header>

                    <Dialog.Body>
                      <Stack spacing="4" align="center">
                        <Box bg="white" p="4" borderRadius="lg" boxShadow="md">
                          <Image
                            src={qrCode}
                            alt="QR Code"
                            width={220}
                            height={220}
                          />
                        </Box>

                        <Input value={eventUrl} readOnly />

                        <HStack spacing="4">
                          <Button onClick={handleCopy}>Copy Link</Button>
                          <Button onClick={handleDownload}>Download</Button>
                        </HStack>
                      </Stack>
                    </Dialog.Body>

                    <Dialog.Footer justifyContent="center"></Dialog.Footer>
                  </>
                )}
              </Dialog.Content>
            </Dialog.Positioner>
          </Portal>
        </Dialog.Root>

        <Button
          colorPalette="teal"
          variant="outline"
          onClick={() => router.push(`/owner/events/${eventId}/media`)}
        >
          View Media
        </Button>
      </HStack>
    </div>
  );
}
