import React, { createContext, useContext, useEffect, useState, useCallback } from "react";
import { supabase } from "../lib/supabase";
import { useAuth } from "./AuthContext";

export interface ActiveBid {
    bidId: string;
    auctionId: string;
    amount: number;
    createdAt: string;
    vehicleBrand: string;
    vehicleModel: string;
    auctionStatus: string;
    currentPrice: number;
    endsAt: string;
    isWinning: boolean;
}

interface BidContextType {
    activeBids: ActiveBid[];
    latestBid: ActiveBid | null;
    totalActiveBids: number;
    isLoading: boolean;
    refreshBids: () => Promise<void>;
}

const BidContext = createContext<BidContextType | undefined>(undefined);

export const BidProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const { user } = useAuth();
    const [activeBids, setActiveBids] = useState<ActiveBid[]>([]);
    const [isLoading, setIsLoading] = useState(false);

    const fetchActiveBids = useCallback(async () => {
        if (!user) {
            setActiveBids([]);
            return;
        }

        try {
            setIsLoading(true);

            // Fetch bids made by the user on active or scheduled auctions
            const { data, error } = await supabase
                .from("bids")
                .select(`
                    id,
                    amount,
                    created_at,
                    auction:auctions(
                        id,
                        status,
                        current_price,
                        ends_at,
                        winner_id,
                        vehicle:vehicles(
                            brand,
                            model
                        )
                    )
                `)
                .eq("bidder_id", user.id)
                .order("created_at", { ascending: false });

            if (error) throw error;

            // Filter to only show bids in active/scheduled auctions
            // and get the highest bid per auction (latest in list since ordered by desc)
            const seenAuctions = new Set<string>();
            const mapped: ActiveBid[] = [];

            for (const bid of (data || [])) {
                const auction = bid.auction as any;
                if (!auction) continue;
                if (!["ativo", "agendado"].includes(auction.status)) continue;
                if (seenAuctions.has(auction.id)) continue;

                seenAuctions.add(auction.id);
                mapped.push({
                    bidId: bid.id,
                    auctionId: auction.id,
                    amount: bid.amount,
                    createdAt: bid.created_at,
                    vehicleBrand: auction.vehicle?.brand || "",
                    vehicleModel: auction.vehicle?.model || "",
                    auctionStatus: auction.status,
                    currentPrice: auction.current_price ?? 0,
                    endsAt: auction.ends_at,
                    isWinning: auction.winner_id === user.id,
                });
            }

            setActiveBids(mapped);
        } catch (err) {
            console.error("BidContext: Erro ao buscar lances ativos:", err);
        } finally {
            setIsLoading(false);
        }
    }, [user]);

    // Initial load + re-fetch on user change
    useEffect(() => {
        fetchActiveBids();
    }, [fetchActiveBids]);

    // Supabase Realtime subscription: listen to new bids by this user
    // and auction updates (price changes, status changes)
    useEffect(() => {
        if (!user) return;

        const channel = supabase
            .channel("bid-context-realtime")
            .on(
                "postgres_changes",
                {
                    event: "INSERT",
                    schema: "public",
                    table: "bids",
                    filter: `bidder_id=eq.${user.id}`,
                },
                () => fetchActiveBids()
            )
            .on(
                "postgres_changes",
                {
                    event: "UPDATE",
                    schema: "public",
                    table: "auctions",
                },
                () => fetchActiveBids()
            )
            .subscribe();

        return () => {
            supabase.removeChannel(channel);
        };
    }, [user, fetchActiveBids]);

    const latestBid = activeBids[0] ?? null;

    return (
        <BidContext.Provider
            value={{
                activeBids,
                latestBid,
                totalActiveBids: activeBids.length,
                isLoading,
                refreshBids: fetchActiveBids,
            }}
        >
            {children}
        </BidContext.Provider>
    );
};

export const useBid = (): BidContextType => {
    const ctx = useContext(BidContext);
    if (!ctx) throw new Error("useBid must be used within a BidProvider");
    return ctx;
};

export default BidContext;
