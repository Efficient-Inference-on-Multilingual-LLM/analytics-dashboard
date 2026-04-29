"use client";

import React from 'react';
import Link from "next/link";
import Image from 'next/image';
import {
    NavigationMenu,
    NavigationMenuContent,
    NavigationMenuItem,
    NavigationMenuLink,
    NavigationMenuList,
    NavigationMenuTrigger,
} from '@/components/ui/navigation-menu';
import { usePathname } from 'next/navigation';

const NAV = [
  {
    label: "Single Model",
    pages: [
      { href: "/single/heatmap", label: "Single Heatmap", desc: "One config, raw matrix" },
      { href: "/single/ranked", label: "Ranked Heatmap", desc: "Sorted by similarity" },
      { href: "/single/clustered", label: "Clustered Heatmap", desc: "Hierarchical clustering" },
      { href: "/single/dynamic", label: "Dynamic Heatmap", desc: "Across layers" },
    ],
  },
  {
    label: "Comparison",
    pages: [
      { href: "/comparison/checkpoint", label: "Checkpoint Trace", desc: "Two languages across layers" },
      { href: "/comparison/cross-model", label: "Cross-Model Aggregate", desc: "Compare multiple models" },
      { href: "/comparison/layer-difference", label: "Layer Difference", desc: "Source vs target layer" },
    ],
  },
  {
    label: "Trends",
    pages: [
      { href: "/trends/cluster", label: "Cluster Trends", desc: "Per-layer cluster metrics" },
    ],
  },
];

const Navbar = () => {
    const pathname = usePathname();

  return (
    <header className='flex items-center gap-6 px-6 py-2 border-b border-border bg-background'>
        <Link href="/" className='flex items-center gap-5'>
            <Image src="/lingviz.svg" alt="LingViz" width={70} height={70} priority />
            <span className='text-2xl font-bold'>LingViz</span>
        </Link>

        <NavigationMenu>
            <NavigationMenuList>
                <NavigationMenuItem>
                    <NavigationMenuLink asChild>
                        <Link href="/" className={'text-xl' + (pathname === "/" ? " font-bold" : "")}>
                            Home
                        </Link>
                    </NavigationMenuLink>
                </NavigationMenuItem>
            </NavigationMenuList>
        </NavigationMenu>

        {NAV.map((group) => {
            const isActive = group.pages.some((page) => page.href === pathname);
            return (
                <NavigationMenu key={group.label}>
                    <NavigationMenuList>
                        <NavigationMenuItem>
                            <NavigationMenuTrigger className={"text-lg font-medium" + (isActive ? " font-bold" : "")}>
                                {group.label}
                            </NavigationMenuTrigger>
                            <NavigationMenuContent>
                                <div className='grid gap-4 p-4 md:w-100 lg:w-125'>
                                    {group.pages.map((page) => (
                                        <Link
                                            key={page.href}
                                            href={page.href}
                                            className={'block rounded-md p-2 hover:bg-muted' + (pathname === page.href ? " bg-muted" : "")}
                                        >
                                            <div className='font-medium'>{page.label}</div>
                                            <p className='text-sm text-muted-foreground'>{page.desc}</p>
                                        </Link>
                                    ))}
                                </div>
                            </NavigationMenuContent>
                        </NavigationMenuItem>
                    </NavigationMenuList>
                </NavigationMenu>
            )
        })}
    </header>
  )
}

export default Navbar