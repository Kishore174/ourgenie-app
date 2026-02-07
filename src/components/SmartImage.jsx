import React, { useState } from "react";
import { Image } from "react-native";

export default function SmartImage({ image, style }) {
  const [failed, setFailed] = useState(false);

  return (
    <Image
      source={{
        uri: failed
          ? image
          : `https://skishore.in/api/public/${image}`
      }}
      style={style}
      resizeMode="cover"
      onError={() => setFailed(true)}
    />
  );
}
