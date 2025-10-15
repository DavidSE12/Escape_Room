"use client";
import { Billboard, Html } from "@react-three/drei";
import { useMemo, useState } from "react";

export default function Hotspot3D({
	position,
	label = "Hotspot",
	size = 0.08,
	onSelect,
	onHoverChange,
}: {
	position: [number, number, number];
	label?: string;
	size?: number;
	onSelect?: () => void;
	onHoverChange?: (v: boolean) => void;
}) {
	const [hover, setHover] = useState(false);
	const color = useMemo(() => ({ base: "#6EE7F9", hover: "#22D3EE" }), []);

	return (
		<group position={position}>
			<Billboard follow>
				<mesh
					onClick={onSelect}
					onPointerOver={() => { setHover(true); onHoverChange?.(true); }}
					onPointerOut={() => { setHover(false); onHoverChange?.(false); }}
					scale={hover ? 1.25 : 1}
			>
				{/* Gem-like icosahedron for a nicer look */}
				<icosahedronGeometry args={[size, 0]} />
				<meshStandardMaterial
					color={hover ? color.hover : color.base}
					emissive={hover ? color.hover : "#1F2937"}
					emissiveIntensity={hover ? 0.9 : 0.4}
					metalness={0.4}
					roughness={0.2}
				/>
			</mesh>

				<Html
					distanceFactor={8}
					style={{
						padding: "2px 6px",
						background: "rgba(0,0,0,0.5)",
						color: "white",
						borderRadius: 6,
						fontSize: 18,
						transform: "translateY(-14px)",
						whiteSpace: "nowrap",
					}}
				>
					{label}
				</Html>
			</Billboard>
		</group>
	);
}
