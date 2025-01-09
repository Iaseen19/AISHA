'use client';

import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useRouter } from 'next/navigation';

export default function Summary() {
  const [summary, setSummary] = useState('');
  const router = useRouter();

  useEffect(() => {
    const sessionSummary = localStorage.getItem('sessionSummary');
    if (sessionSummary) {
      setSummary(sessionSummary);
    }
  }, []);

  return (
    <div className="max-w-2xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Session Summary</h1>
      <Card className="mb-4">
        <CardContent className="p-4">
          {summary ? (
            <div className="prose">
              <p>{summary}</p>
            </div>
          ) : (
            <p>No summary available</p>
          )}
        </CardContent>
      </Card>
      <Button onClick={() => router.push('/')}>Back to Chat</Button>
    </div>
  );
}

