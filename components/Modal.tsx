"use client";

import { addUserEmailToProduct } from "@/lib/actions";
import {
  Description,
  Dialog,
  DialogPanel,
  DialogTitle,
} from "@headlessui/react";

import { AnimatePresence, motion } from "framer-motion";
import Image from "next/image";
import { FormEvent, useState } from "react";

interface ModalProps {
    productId: string;
}

const Modal = ({productId}: ModalProps) => {
  let [isOpen, setIsOpen] = useState(false);
  let [isSubmitting, setIsSubmitting] = useState(false);
  let [email, setEmail] = useState("");

  const handleSubmit = async (e:FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!email) {
      alert("Please enter a valid email address");
      return;
    }

    setIsSubmitting(true);
    await addUserEmailToProduct(productId, email)
    setIsSubmitting(false);
    setEmail("");
    closeModal();
  };

  const openModal = () => {
    setIsOpen(true);
  };

  const closeModal = () => {
    setIsOpen(false);
  };

  return (
    <>
      <button type="button" className="btn" onClick={openModal}>
        Track
      </button>

      <AnimatePresence>
        {isOpen && (
          <Dialog
            static
            open={isOpen}
            onClose={() => setIsOpen(false)}
            className="relative z-50"
          >
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/30"
            />
            <div className="fixed inset-0 flex w-screen items-center justify-center p-4">
              <DialogPanel
                as={motion.div}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="max-w-lg space-y-4 bg-white p-12 rounded-xl"
              >
                <div className="flex justify-between items-center">
                  <Image
                    src="/assets/icons/logo.svg"
                    alt="logo"
                    width={28}
                    height={28}
                  />
                  <Image
                    src="/assets/icons/x-close.svg"
                    alt="close"
                    width={28}
                    height={28}
                    onClick={closeModal}
                  />
                </div>

                <h4 className="dialog-head_text">
                  Stay updated with product pricing alerts right in your inbox!
                </h4>
                <p className="text-sm text-gray-600 mt-2">
                  Never miss a bargain again with our timely alerts!
                </p>

                <form className="flex flex-col mt-6" onSubmit={handleSubmit}>
                  <label
                    htmlFor="email"
                    className="text-sm font-medium text-gray-700"
                  >
                    Email address
                  </label>
                  <div className="dialog-input_container">
                    <Image
                      src="/assets/icons/mail.svg"
                      alt="mail"
                      width={18}
                      height={18}
                    />
                    <input
                      required
                      type="email"
                      id="email"
                      value={email}
                      onChange={(e)=> setEmail(e.target.value)}
                      placeholder="Enter your email address"
                      className="dialog-input"
                    />
                  </div>
                  <button
                    onClick={() => setIsOpen(false)}
                    className="dialog-btn"
                  >
                    {isSubmitting ? "Submitting..." : "Track"}
                  </button>
                </form>
              </DialogPanel>
            </div>
          </Dialog>
        )}
      </AnimatePresence>
    </>
  );
};

export default Modal;
