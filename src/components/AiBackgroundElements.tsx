
import React from "react";

const AiBackgroundElements = () => {
  return (
    <>
      {/* Background pattern */}
      <div className="fixed inset-0 bg-ai-pattern opacity-30"></div>
      
      {/* Floating elements */}
      <div className="fixed size-40 rounded-full bg-lavender-500/10 blur-3xl top-20 -left-20 animate-float"></div>
      <div className="fixed size-60 rounded-full bg-lavender-300/10 blur-3xl bottom-20 -right-20 animate-float" style={{ animationDelay: '1.5s' }}></div>
      <div className="fixed size-24 rounded-full bg-lavender-400/5 blur-2xl top-1/3 right-1/4 animate-float" style={{ animationDelay: '2.2s' }}></div>
      
      {/* Circuit lines */}
      <div className="fixed inset-0 bg-circuit-pattern opacity-30"></div>
      
      {/* AI nodes */}
      <div className="fixed size-3 rounded-full bg-lavender-400 top-1/4 left-1/4 shadow-lg shadow-lavender-400/20 animate-pulse-glow"></div>
      <div className="fixed size-2 rounded-full bg-lavender-500 bottom-1/3 right-1/3 shadow-lg shadow-lavender-500/20 animate-pulse-glow" style={{ animationDelay: '1s' }}></div>
      <div className="fixed size-4 rounded-full bg-lavender-300 top-2/3 left-1/5 shadow-lg shadow-lavender-300/20 animate-pulse-glow" style={{ animationDelay: '2s' }}></div>
      
      {/* AI rotating ring */}
      <div className="fixed w-[300px] h-[300px] rounded-full border-2 border-lavender-300/10 top-1/2 -translate-y-1/2 left-1/2 -translate-x-1/2 animate-spin-slow"></div>
      <div className="fixed w-[500px] h-[500px] rounded-full border border-lavender-400/5 top-1/2 -translate-y-1/2 left-1/2 -translate-x-1/2 animate-spin-slow" style={{ animationDuration: '20s' }}></div>
    </>
  );
};

export default AiBackgroundElements;
