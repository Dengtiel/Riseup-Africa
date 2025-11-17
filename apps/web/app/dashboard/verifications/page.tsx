"use client";

import { useState, useEffect } from "react";
import { verificationApi } from "@/lib/api";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@workspace/ui/components/card";
import { Button } from "@workspace/ui/components/button";
import { Badge } from "@workspace/ui/components/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@workspace/ui/components/select";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@workspace/ui/components/dialog";
import { Textarea } from "@workspace/ui/components/textarea";
import { Label } from "@workspace/ui/components/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@workspace/ui/components/table";
import { toast } from "sonner";
import type { Verification } from "@/lib/types";
import { IconClipboardCheck } from "@tabler/icons-react";

export default function VerificationsPage() {
  const [verifications, setVerifications] = useState<Verification[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedVerification, setSelectedVerification] = useState<any>(null);
  const [reviewStatus, setReviewStatus] = useState<"VERIFIED" | "REJECTED" | "UNDER_REVIEW">("VERIFIED");
  const [reviewNotes, setReviewNotes] = useState("");
  const [showReviewDialog, setShowReviewDialog] = useState(false);
  const [reviewing, setReviewing] = useState(false);

  useEffect(() => {
    loadVerifications();
  }, []);

  const loadVerifications = async () => {
    try {
      const data = await verificationApi.getPendingVerifications();
      setVerifications(data);
    } catch (error) {
      toast.error("Failed to load verifications");
    } finally {
      setLoading(false);
    }
  };

  const handleReview = async () => {
    if (!selectedVerification) return;

    setReviewing(true);
    try {
      await verificationApi.reviewVerification(selectedVerification.id, {
        status: reviewStatus,
        notes: reviewNotes || undefined,
      });
      toast.success("Verification reviewed successfully!");
      setShowReviewDialog(false);
      setSelectedVerification(null);
      setReviewNotes("");
      loadVerifications();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to review verification");
    } finally {
      setReviewing(false);
    }
  };

  const openReviewDialog = (verification: any) => {
    setSelectedVerification(verification);
    setReviewStatus("VERIFIED");
    setReviewNotes("");
    setShowReviewDialog(true);
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Pending Verifications</h2>
        <p className="text-muted-foreground">
          Review and approve youth verifications
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Verifications</CardTitle>
          <CardDescription>Youth awaiting verification</CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-8 text-muted-foreground">Loading...</div>
          ) : verifications.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              <IconClipboardCheck className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No pending verifications</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Youth</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Location</TableHead>
                  <TableHead>Documents</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {verifications.map((verification) => (
                  <TableRow key={verification.id}>
                    <TableCell>
                      <div>
                        <div className="font-medium">
                          {verification.user?.firstName} {verification.user?.lastName}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {verification.user?.email}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">
                        {verification.user?.category || "N/A"}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">
                        {verification.user?.country || "N/A"}
                        {verification.user?.camp && (
                          <div className="text-muted-foreground">
                            {verification.user.camp}
                          </div>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      {verification.user?.documents?.length || 0} documents
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => openReviewDialog(verification)}
                      >
                        Review
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      <Dialog open={showReviewDialog} onOpenChange={setShowReviewDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Review Verification</DialogTitle>
            <DialogDescription>
              Review and approve or reject this verification
            </DialogDescription>
          </DialogHeader>
          {selectedVerification && (
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label>Status</Label>
                <Select
                  value={reviewStatus}
                  onValueChange={(value) =>
                    setReviewStatus(value as typeof reviewStatus)
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="VERIFIED">Verified</SelectItem>
                    <SelectItem value="REJECTED">Rejected</SelectItem>
                    <SelectItem value="UNDER_REVIEW">Under Review</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="notes">Notes</Label>
                <Textarea
                  id="notes"
                  value={reviewNotes}
                  onChange={(e) => setReviewNotes(e.target.value)}
                  placeholder="Add review notes..."
                  rows={4}
                />
              </div>
            </div>
          )}
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowReviewDialog(false)}
            >
              Cancel
            </Button>
            <Button onClick={handleReview} disabled={reviewing}>
              {reviewing ? "Processing..." : "Submit Review"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

