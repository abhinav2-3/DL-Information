"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface DocumentData {
  documentNumber: string;
  name: string;
  expirationDate: string;
}

const API = process.env.API || "https://dl-information.onrender.com/extract";

const DocumentCapture: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [documentData, setDocumentData] = useState<DocumentData | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0] || null;
    setFile(selectedFile);
  };

  const handleFetchData = async () => {
    if (!file) return;
    setLoading(true);

    const formData = new FormData();
    formData.append("document", file);

    try {
      const response = await fetch(API, {
        method: "POST",
        body: formData,
      });
      const data = await response.json();
      setDocumentData(data);
    } catch (error) {
      console.error("Error fetching document data:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="p-6 max-w-md mx-auto bg-white shadow-lg rounded-lg">
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-center">
          Upload and Extract DL Data
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="my-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Select DL Photo :
          </label>
          <Input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="w-full border border-gray-300 rounded-lg"
          />
        </div>
        <Button
          onClick={handleFetchData}
          disabled={!file || loading}
          className="w-full mt-4 bg-blue-500 text-white hover:bg-blue-600 transition-all"
        >
          {loading ? "Extracting Data..." : "Fetch Document Data"}
        </Button>

        {documentData && (
          <div className="mt-6 border-t pt-4">
            <h2 className="text-lg font-semibold text-gray-800">
              Extracted Data:
            </h2>
            <p>
              <strong>Document Number:</strong>{" "}
              {documentData.documentNumber ? documentData.documentNumber : "NA"}
            </p>
            <p>
              <strong>Name:</strong>{" "}
              {documentData.name ? documentData.name : "NA"}
            </p>
            <p>
              <strong>Expiry Date:</strong>{" "}
              {documentData.expirationDate ? documentData.expirationDate : "NA"}
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default DocumentCapture;
