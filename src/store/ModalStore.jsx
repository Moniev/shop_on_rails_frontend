import { create } from 'zustand';

export const useModalStore = create((set) => ({
  modalType: null,  
  modalProps: {},   
  isOpen: false,

  openModal: (type, props = {}) => set({ 
    isOpen: true, 
    modalType: type, 
    modalProps: props 
  }),

  closeModal: () => set({ 
    isOpen: false, 
    modalType: null, 
    modalProps: {} 
  }),
}));