import React from "react";

const Modal = ({ isOpen, onClose, children, header, onConfirm }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white dark:bg-gray-900 rounded-lg shadow-lg max-w-lg w-full">
        <div className="p-4 flex justify-between items-center border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">{header}</h2>
          <button onClick={onClose} className="border p-0 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
            ×
          </button>
        </div>
        <div className="p-4">{children}</div>
        {onConfirm && (
          <div className="flex justify-end p-4 border-t border-gray-200 dark:border-gray-700">
            <button
              onClick={onClose}
              className="text-gray-500 bg-white border border-gray-300 focus:outline-none hover:bg-gray-100 focus:ring-4 focus:ring-gray-100 font-medium rounded-lg text-sm px-4 py-2 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:bg-gray-700 mr-2"
            >
              Cancel
            </button>
            <button
              onClick={onConfirm}
              className="text-white bg-red-600 border border-red-600 focus:outline-none hover:bg-red-700 focus:ring-4 focus:ring-red-300 font-medium rounded-lg text-sm px-4 py-2"
            >
              Confirm
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Modal;
