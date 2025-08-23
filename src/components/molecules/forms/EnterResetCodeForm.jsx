import Button from "../../atoms/button/Button";
import { useFormik } from "formik";
import { FaTimes, FaHashtag } from "react-icons/fa";
import { useModalStore } from "../../../store/ModalStore";
import { useAuthStore } from "../../../store/AuthStore";
import { toast } from 'react-toastify';
import * as Yup from "yup";
import "./SignInForm.scss";
import { useEffect } from "react";

const EnterResetCodeForm = () => {
  const { closeModal, openModal, modalProps } = useModalStore();
  const email = modalProps?.email;
  const resendResetCode = useAuthStore((state) => state.requestPasswordReset);

  useEffect(() => {
    if (!email) {
      toast.error("An unexpected error occurred. Please try again from the beginning.");
      closeModal();
    }
  }, [email, closeModal]);


  const formik = useFormik({
    initialValues: {
      resetCode: "",
    },
    validationSchema: Yup.object({
      resetCode: Yup.string()
        .min(8, "Reset code must be 8 characters long")
        .required("Code is required"),
    }),
    onSubmit: (values) => {
      closeModal();
      openModal('createNewPassword', { 
        email: email, 
        resetCode: values.resetCode 
      });
    },
  });

  const handleFocus = (e) => {
    formik.setFieldError(e.target.name, '');
  };

  const getIconClassName = (field) => {
    if (formik.touched[field] && formik.errors[field]) return "is-error";
    return "";
  };

  return (
    <div className="sign-in-form__container">
      <Button
        onClick={closeModal}
        variant="submit md circle modal-close-button"
      >
        <FaTimes />
      </Button>
      <h2 className="sign-in-form__title">Code Verification</h2>

      <form onSubmit={formik.handleSubmit} className="sign-in-form__form">
        <p className="sign-in-form__description">
          Enter the code we sent to your email address.
        </p>
        
        <div className="sign-in-form__group">
          <label htmlFor="resetCode" className="sign-in-form__label">
            Code from Email
          </label>
          <div className="sign-in-form__input-wrapper">
            <FaHashtag className={`sign-in-form__input-icon ${getIconClassName('resetCode')}`} />
            <input
              type="text"
              name="resetCode"
              id="resetCode"
              className={`sign-in-form__input ${getIconClassName('resetCode')}`}
              placeholder={formik.touched.resetCode && formik.errors.resetCode ? formik.errors.resetCode : "Enter the code"}
              value={formik.values.resetCode}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              onFocus={handleFocus}
            />
          </div>
        </div>
        
        <Button type="submit" variant="submit">
          Next
        </Button>
      </form>
      <div className="sign-in-form__footer">
        <p>Didn't receive code?
          <a onClick={resendResetCode} className="sign-in-form__link">
             Resend!
          </a>
        </p>
      </div>
    </div>
  );
};

export default EnterResetCodeForm;