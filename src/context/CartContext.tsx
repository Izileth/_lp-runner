import React, { createContext, useContext, useState, useMemo } from "react";
import type { CartItem } from "../types";

interface CartContextType {
    cartItems: CartItem[];
    bagTotal: number;
    bagItemsCount: number;
    addToBag: (item: Omit<CartItem, "quantity">) => void;
    clearCart: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [cartItems, setCartItems] = useState<CartItem[]>([]);

    const addToBag = (newItem: Omit<CartItem, "quantity">) => {
        setCartItems((prevItems) => {
            const existingItemIndex = prevItems.findIndex(
                (item) => item.id === newItem.id && item.details === newItem.details
            );

            if (existingItemIndex > -1) {
                const updatedItems = [...prevItems];
                updatedItems[existingItemIndex].quantity += 1;
                return updatedItems;
            }

            return [...prevItems, { ...newItem, quantity: 1 }];
        });
    };

    const clearCart = () => {
        setCartItems([]);
    };

    const bagItemsCount = useMemo(() => {
        return cartItems.reduce((total, item) => total + item.quantity, 0);
    }, [cartItems]);

    const bagTotal = useMemo(() => {
        return cartItems.reduce((total, item) => total + item.price * item.quantity, 0);
    }, [cartItems]);

    return (
        <CartContext.Provider
            value={{
                cartItems,
                bagTotal,
                bagItemsCount,
                addToBag,
                clearCart,
            }}
        >
            {children}
        </CartContext.Provider>
    );
};

export const useCart = () => {
    const context = useContext(CartContext);
    if (!context) {
        throw new Error("useCart must be used within a CartProvider");
    }
    return context;
};
