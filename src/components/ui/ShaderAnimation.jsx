"use client"

import { useEffect, useRef, useState } from "react"
import * as THREE from "three"

/**
 * Performance Optimized Liquid Ripple Shader.
 * Features:
 * 1. Pixel Ratio Limiting (1.0) for 60fps on low-spec hardware.
 * 2. Simplified fractal logic (reduced loop passes).
 * 3. Intersection Observer (Ref-based) to pause rendering when off-screen.
 */
export function ShaderAnimation() {
  const containerRef = useRef(null)
  const sceneRef = useRef(null)
  const isVisibleRef = useRef(false)

  // Intersection Observer to stop rendering when not in view
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        isVisibleRef.current = entry.isIntersecting
      },
      { threshold: 0.1 }
    )
    if (containerRef.current) observer.observe(containerRef.current)
    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    if (!containerRef.current) return

    const container = containerRef.current
    let animationId;

    // Optimized Shaders
    const vertexShader = `
      varying vec2 vUv;
      void main() {
        vUv = uv;
        gl_Position = vec4( position, 1.0 );
      }
    `

    const fragmentShader = `
      precision highp float;
      uniform vec2 resolution;
      uniform float time;
      void main(void) {
        vec2 uv = (gl_FragCoord.xy * 2.0 - resolution.xy) / min(resolution.x, resolution.y);
        
        // Fixed origin for non-reactive liquid effect
        vec2 m = vec2(0.0);
        float d = distance(uv, m);
        float ripple = sin(d * 10.0 - time * 2.0);
        float distortionStrength = exp(-d * 4.0) * 0.12; 
        
        vec2 distortedUv = uv + normalize(uv - m) * ripple * distortionStrength;
        
        float t = time * 0.05;
        float lineWidth = 0.002;

        vec3 color = vec3(0.0);
        float finalIntensity = 0.0;
        
        // Increased iterations slightly for a richer monochromatic look
        for(int i=0; i < 5; i++){
          float intensity = float(i * i) + 1.0;
          float pulse = fract(t + float(i) * 0.03) * 5.0;
          float lineDef = abs(pulse - length(distortedUv) + mod(distortedUv.x + distortedUv.y, 0.25));
          finalIntensity += lineWidth * intensity / lineDef;
        }
        
        color = vec3(finalIntensity);
        color = clamp(color, 0.0, 1.0);
        gl_FragColor = vec4(color, 1.0);
      }
    `

    const camera = new THREE.Camera()
    camera.position.z = 1

    const scene = new THREE.Scene()
    const geometry = new THREE.PlaneGeometry(2, 2)

    const uniforms = {
      time: { type: "f", value: 1.0 },
      resolution: { type: "v2", value: new THREE.Vector2() }
    }

    const material = new THREE.ShaderMaterial({
      uniforms: uniforms,
      vertexShader: vertexShader,
      fragmentShader: fragmentShader,
    })

    const mesh = new THREE.Mesh(geometry, material)
    scene.add(mesh)

    let renderer;
    try {
      renderer = new THREE.WebGLRenderer({ antialias: false, powerPreference: "high-performance" })
      renderer.setPixelRatio(1.0)
    } catch (e) {
      console.error("WebGL context creation failed:", e)
      return;
    }

    container.appendChild(renderer.domElement)


    const onWindowResize = () => {
      const width = container.clientWidth
      const height = container.clientHeight
      renderer.setSize(width, height)
      uniforms.resolution.value.x = renderer.domElement.width
      uniforms.resolution.value.y = renderer.domElement.height
    }

    onWindowResize()
    window.addEventListener("resize", onWindowResize, false)

    const animate = () => {
      if (isVisibleRef.current) {
        uniforms.time.value += 0.03
        renderer.render(scene, camera)
      }
      animationId = requestAnimationFrame(animate)
    }

    sceneRef.current = {
      camera,
      scene,
      renderer,
      uniforms,
      animationId: 0,
    }

    animate()

    return () => {
      window.removeEventListener("resize", onWindowResize)

      if (sceneRef.current) {
        cancelAnimationFrame(animationId)
        if (container && sceneRef.current.renderer.domElement) {
          container.removeChild(sceneRef.current.renderer.domElement)
        }
        sceneRef.current.renderer.dispose()
        if (geometry) geometry.dispose()
        if (material) material.dispose()
      }
    }
  }, [])

  return (
    <div
      ref={containerRef}
      className="w-full h-full"
      style={{
        background: "#000",
        overflow: "hidden",
        pointerEvents: "none"
      }}
    />
  )
}
