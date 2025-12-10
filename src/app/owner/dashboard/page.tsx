"use client";

import {
  HStack,
  Button,
  Dialog,
  Input,
  Portal,
  Stack,
  useDisclosure,
} from "@chakra-ui/react";
import Image from "next/image";
import { useState } from "react";

export default function OwnerDashboardPage() {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [eventUrl, setEventUrl] = useState("");
  const [qrCode, setQrCode] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleCreateEvent = async () => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/events", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: "New Event" }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to create event");

      setEventUrl(data.eventUrl);
      setQrCode(data.qrCodeDataURL);
    } catch (err) {
      alert(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(eventUrl);
    alert("Event link copied to clipboard!");
  };

  const handleDownloadQR = () => {
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
          <Portal isOpen={isOpen} onClose={onClose}>
            <Dialog.Backdrop />
            <Dialog.Positioner>
              <Dialog.Content>
                <Dialog.Header>
                  <Dialog.Title>New Event Created 🎉</Dialog.Title>
                </Dialog.Header>

                <Dialog.Body pb="4">
                  <Stack spacing="4" align="center">
                    {isLoading && <p>Creating event...</p>}
                    {eventUrl && (
                      <>
                        <Input value={eventUrl} isReadOnly textAlign="center" />
                        <HStack spacing="4">
                          <Button colorScheme="blue" onClick={handleCopy}>
                            Copy Link
                          </Button>
                          <Button
                            colorScheme="green"
                            onClick={handleDownloadQR}
                          >
                            Download QR
                          </Button>
                        </HStack>
                        <Image
                          src={qrCode}
                          alt="QR Code"
                          width={150}
                          height={150}
                        />
                      </>
                    )}
                  </Stack>
                </Dialog.Body>

                <Dialog.Footer>
                  <Button variant="ghost" onClick={onClose}>
                    Close
                  </Button>
                  {!eventUrl && (
                    <Button
                      colorScheme="teal"
                      isLoading={isLoading}
                      onClick={handleCreateEvent}
                    >
                      Create
                    </Button>
                  )}
                </Dialog.Footer>
              </Dialog.Content>
            </Dialog.Positioner>
          </Portal>
        </Dialog.Root>

        <Button colorScheme="teal" variant="outline">
          View Media
        </Button>
      </HStack>
    </div>
  );
}
