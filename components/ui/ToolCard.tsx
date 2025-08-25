'use client';

import React, { useState } from 'react';
import { Button } from './Button';

interface Tool {
  name: string;
  price: string;
  rating: number;
  users: string;
  category: string;
  available: boolean;
}

interface ToolCardProps {
  tool: Tool;
}

export const ToolCard: React.FC<ToolCardProps> = ({ tool }) => {
  const [isHovered, setIsHovered] = useState(false);

  const getToolLogo = (name: string) => {
    const logoMap: { [key: string]: string } = {
      'Adobe Photoshop': '/logos/Photoshop.png',
      'Adobe Illustrator': '/logos/Illustrator.png',
      'Adobe After Effects': '/logos/After effects.PNG',
      'Adobe Premiere Pro': '/logos/Premiere pro.PNG',
      'Adobe InDesign': '/logos/Indesign.PNG',
      'Adobe XD': '/logos/adobe xd.png',
      'Adobe Lightroom': '/logos/Lightroom.png',
      'Cinema 4D': '/logos/Cinema 4D.PNG',
      'ChatGPT Plus': '/logos/ChatGPT.png',
      'Midjourney': '/logos/Midjourney.png',
      'Claude Pro': '/logos/Claude.png',
      'Runway ML': '/logos/Runway ML.PNG',
      'Jasper AI': '/logos/Jasper AI.png',
      'Copy.ai': '/logos/CopyAI.png',
      'Stable Diffusion': '/logos/StableDiffusion.png',
      'GitHub Copilot': '/logos/Github Copilot.PNG',
      'JetBrains IntelliJ': '/logos/IntelliJ.png',
      'Visual Studio Pro': '/logos/VisualStudio.png',
      'Sublime Text': '/logos/SublimeText.png',
      'Docker Desktop': '/logos/Docker.png',
      'Postman Pro': '/logos/PostmanPro.png',
      'MongoDB Atlas': '/logos/mongodbatlas.png',
      'Figma Pro': '/logos/Figma.png',
      'Figma Professional': '/logos/Figma.png',
      'Sketch': '/logos/Sketch.png',
      'Canva Pro': '/logos/Canva.png',
      'Framer': '/logos/Framer.png',
      'InVision': '/logos/InVision.png',
      'Principle': '/logos/Principle.PNG',
      'Zeplin': '/logos/Zeplin.PNG',
      'Marvel App': '/logos/marvel app.png',
      'Final Cut Pro': '/logos/Final Cut Pro.PNG',
      'DaVinci Resolve Studio': '/logos/DV resolve.png',
      'Motion': '/logos/Motion.png',
      'Compressor': '/logos/Compressor.PNG',
      'FCPX Plugins Bundle': '/logos/FCPX.png',
      'Luma Fusion': '/logos/LumaFusion.png',
      'Filmora Pro': '/logos/Filmora.png',
      'Microsoft Office 365': '/logos/Office365.png',
      'Notion Pro': '/logos/Notion.png',
      'Slack Pro': '/logos/Slack.png',
      'Zoom Pro': '/logos/Zoom.png',
      'Trello Gold': '/logos/Trello.png',
      'Asana Premium': '/logos/Asana.png',
      'Dropbox Plus': '/logos/Dropbox.png',
      'LastPass Premium': '/logos/LastPass.png',
      'AutoCAD': '/logos/AutoCAD.png'
    };
    
    return logoMap[name];
  };

  return (
    <div
      className={`flex-shrink-0 w-72 modern-card overflow-hidden cursor-pointer group ${
        isHovered ? 'transform scale-105 glow-effect' : ''
      }`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Enhanced Tool Header */}
      <div className="relative h-36 bg-gradient-to-br from-accent/5 via-white to-secondary/10 p-6 flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent group-hover:from-accent/10 transition-all duration-500"></div>
        <div className="absolute inset-0 bg-pattern opacity-30"></div>
        <img 
          src={getToolLogo(tool.name)} 
          alt={tool.name}
          className="w-18 h-18 object-contain relative z-10 floating-animation group-hover:scale-110 transition-transform duration-500"
          onError={(e) => {
            // Fallback to a default icon if image fails to load
            e.currentTarget.style.display = 'none';
            e.currentTarget.nextElementSibling!.style.display = 'block';
          }}
        />
        <div className="text-4xl mb-2 relative z-10 floating-animation hidden group-hover:scale-110 transition-transform">
          {tool.name.includes('Adobe') ? '🎨' : 
           tool.name.includes('AI') ? '🤖' : 
           tool.name.includes('Figma') ? '🎯' : '⚡'}
        </div>
        {!tool.available && (
          <div className="absolute top-4 right-4 bg-red-500/95 backdrop-blur-sm text-white text-xs px-3 py-1.5 rounded-full shadow-lg font-semibold">
            Unavailable
          </div>
        )}
        {tool.available && (
          <div className="absolute top-4 right-4 bg-green-500/95 backdrop-blur-sm text-white text-xs px-3 py-1.5 rounded-full shadow-lg font-semibold animate-pulse">
            Available
          </div>
        )}
      </div>

      {/* Tool Info */}
      <div className="p-6">
        <div className="mb-4">
          <h3 className="text-lg font-semibold text-dark mb-1 truncate">{tool.name}</h3>
          <p className="text-sm text-dark/60">{tool.category}</p>
        </div>

        {/* Stats */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center">
            <div className="flex items-center text-yellow-500 mr-2">
              <svg className="w-4 h-4 fill-current" viewBox="0 0 20 20">
                <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z"/>
              </svg>
              <span className="text-sm font-medium text-dark ml-1">{tool.rating}</span>
            </div>
            <span className="text-sm text-dark/60">({tool.users} users)</span>
          </div>
          <div className="text-right">
            <div className="text-lg font-bold text-accent">{tool.price}</div>
          </div>
        </div>

        {/* Enhanced Action Button */}
        {tool.available ? (
          <a href={`/rent/${encodeURIComponent(tool.name)}`}>
            <button className="btn-primary w-full flex items-center justify-center gap-2 group">
              <span>Rent Now</span>
              <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </button>
          </a>
        ) : (
          <button className="btn-secondary w-full opacity-50 cursor-not-allowed" disabled>
            Notify When Available
          </button>
        )}

        {/* Quick Info */}
        {isHovered && tool.available && (
          <div className="mt-4 p-4 bg-gradient-to-r from-primary/30 to-secondary/30 backdrop-blur-sm rounded-xl border border-white/20">
            <div className="flex justify-between text-sm items-center">
              <span className="text-dark/70">Instant Access</span>
              <span className="text-green-500 font-bold text-lg">✓</span>
            </div>
            <div className="flex justify-between text-sm mt-2 items-center">
              <span className="text-dark/70">24/7 Support</span>
              <span className="text-green-500 font-bold text-lg">✓</span>
            </div>
            <div className="flex justify-between text-sm mt-2 items-center">
              <span className="text-dark/70">Money Back Guarantee</span>
              <span className="text-green-500 font-bold text-lg">✓</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};