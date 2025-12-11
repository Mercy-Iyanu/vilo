"use client";

import { useState } from "react";
import { Box, Button, Input, Text, VStack, Progress } from "@chakra-ui/react";
import { useParams } from "next/navigation";

export default function GuestUploadPage() {
  const params = useParams();
  const eventId = params.eventId;

  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);

  const handleUpload = async () => {
    if (!file) {
      alert("Select a photo or video first!");
      return;
    }

    setLoading(true);

    const formData = new FormData();
    formData.append("file", file);
    formData.append("eventId", eventId);

    console.log("file:", file);
    console.log("eventId:", eventId);

    const res = await fetch("/api/upload", {
      method: "POST",
      body: formData,
    });

    const data = await res.json();
    setLoading(false);

    if (!res.ok) {
      alert(data.error);
    } else {
      alert("Upload successful! 🎉");
      setFile(null);
    }
  };

  return (
    <Box p="6" textAlign="center">
      <Text fontSize="2xl" fontWeight="bold">
        Upload Memories 💛
      </Text>

      <VStack mt="6" spacing="4">
        <Input
          type="file"
          accept="image/*,video/*"
          onChange={(e) => setFile(e.target.files?.[0] || null)}
        />

        {loading && (
          <Progress.Root value={progress} w="100%" striped colorPalette="teal">
            <Progress.Track>
              <Progress.Range />
            </Progress.Track>
          </Progress.Root>
        )}

        <Button colorPalette="teal" onClick={handleUpload} isLoading={loading}>
          Upload
        </Button>
      </VStack>
    </Box>
  );
}
