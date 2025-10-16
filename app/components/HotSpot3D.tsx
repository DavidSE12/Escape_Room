"use client";
import { Billboard } from "@react-three/drei";
import { useMemo, useState } from "react";

export default function Hotspot3D({
	position,
	label,
	size = 0.08,
	onSelect,
	onHoverChange,
}: {
	position: [number, number, number]; // x,y,z on matrix
	label?: string;
	size?: number;
	onSelect?: () => void;
	onHoverChange?: (v: boolean) => void;
}) {
	const [hover, setHover] = useState(false);
	const color = useMemo(() => ({ base: "#A7F3D0", hover: "#6EE7B7" }), []); // light mint -> green

	return (
		<group position={position}>
			{/* Make sure the mesh always be front of user's vision */}
			<Billboard follow>
				
				<mesh
					onClick={onSelect}
					onPointerOver={() => { setHover(true); onHoverChange?.(true); }}
					onPointerOut={() => { setHover(false); onHoverChange?.(false); }}
					scale={hover ? 1.25 : 1}
			>
				<sphereGeometry args={[size, 24, 24]} />  {/* The shape of mesh: circle  */}
				<meshStandardMaterial
					color={hover ? color.hover : color.base}
					emissive={hover ? color.hover : color.base}
					emissiveIntensity={hover ? 1.1 : 0.6}
					metalness={0.25}
					roughness={0.2}
				/>
			</mesh>
			</Billboard>
		</group>
	);
}
