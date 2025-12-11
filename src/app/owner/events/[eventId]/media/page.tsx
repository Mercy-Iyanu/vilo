"use client";

import { useEffect, useState } from "react";
import { Box, Grid, Spinner, Text } from "@chakra-ui/react";
import Image from "next/image";
import ReactPlayer from "react-player";

export default function EventMediaPage({ params }) {
  const { eventId } = params;

  const [media, setMedia] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadMedia() {
      try {
        const res = await fetch(`/api/media/${eventId}`);
        const data = await res.json();
        setMedia(data.media || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }

    loadMedia();
  }, [eventId]);

  if (loading)
    return (
      <Box textAlign="center" mt="20">
        <Spinner size="xl" />
      </Box>
    );

  if (media.length === 0)
    return (
      <Text textAlign="center" mt="20" fontSize="lg" color="gray.500">
        No media uploaded yet.
      </Text>
    );

  return (
    <Box p="6">
      <Text fontSize="2xl" fontWeight="bold" mb="4">
        Event Media
      </Text>

      <Grid templateColumns="repeat(auto-fill, minmax(250px, 1fr))" gap="6">
        {media.map((item) => (
          <Box
            key={item._id}
            bg="white"
            borderRadius="lg"
            boxShadow="md"
            overflow="hidden"
          >
            {item.type === "photo" ? (
              <Image
                src={item.url}
                alt="Event media"
                width={400}
                height={400}
                style={{ objectFit: "cover", width: "100%", height: 250 }}
              />
            ) : (
              <ReactPlayer
                url={item.url}
                width="100%"
                height="250px"
                controls
              />
            )}
          </Box>
        ))}
      </Grid>
    </Box>
  );
}
