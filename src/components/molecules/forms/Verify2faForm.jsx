import Button from "../../atoms/button/Button";
import { useFormik } from "formik";
import { FaTimes, FaLock } from "react-icons/fa";
import { useModalStore } from "../../../store/ModalStore";
import { useAuthStore } from "../../../store/AuthStore";
import { toast } from 'react-toastify';
import * as Yup from "yup";
import "./SignInForm.scss";
import { useEffect } from "react";

const Verify2faForm = () => {
  const { closeModal, modalProps } = useModalStore();
  const email = modalProps?.email;  
  const resend2faCode = useAuthStore((state) => state.resendTwoFactor);
  const verifyTwoFactor = useAuthStore((state) => state.verifyTwoFactor);
  const loading = useAuthStore((state) => state.loading);
  const clearAuthStatus = useAuthStore((state) => state.clearAuthStatus);

   useEffect(() => {
    if (!email) {
      toast.error("An error occurred (Email missing). Please try to log in again.");
      closeModal();
    }
  }, [email, closeModal]);


  const formik = useFormik({
    initialValues: {
      secondFactorCode: "",
    },
    validationSchema: Yup.object({
      secondFactorCode: Yup.string()
        .matches(/^[0-9]+$/, "The code must only contain digits")
        .length(8, "The code must be exactly 6 digits")
        .required("The code is required"),
    }),
    onSubmit: async (values, { setSubmitting }) => {
      const response = await verifyTwoFactor(email, values.secondFactorCode);
      if (response && response.data.success) {
        toast.success("Logged in successfully!");
        closeModal(); 
      } else {
        const apiError = useAuthStore.getState().error;
        const errorMessage = Array.isArray(apiError) ? apiError.join(', ') : apiError || "Your code is incorrect";
        toast.error(errorMessage);
        formik.setFieldValue('secondFactorCode', ''); 
      }
      setSubmitting(false);
    },
  });

  const handleFocus = (e) => {
    const { name } = e.target;
    formik.setFieldError(name, '');
    formik.setFieldTouched(name, false, false);
    clearAuthStatus();
  };

  const getIconClassName = (field) => {
    if (formik.touched[field] && formik.errors[field]) return "is-error";
    if (formik.touched[field] && !formik.errors[field]) return "is-success";
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
      <h2 className="sign-in-form__title">Two-Factor Authentication</h2>

      <form onSubmit={formik.handleSubmit} className="sign-in-form__form">
        <p className="sign-in-form__description">
          Enter your 8-digit code.
        </p>
        <div className="sign-in-form__group">
          <label htmlFor="secondFactorCode" className="sign-in-form__label">
            Verification Code
          </label>
          <div className="sign-in-form__input-wrapper">
            <FaLock className={`sign-in-form__input-icon ${getIconClassName('secondFactorCode')}`} />
            <input
              type="tel" 
              name="secondFactorCode"
              id="secondFactorCode"
              className={`sign-in-form__input ${getIconClassName('secondFactorCode')}`}
              placeholder={formik.touched.secondFactorCode && formik.errors.secondFactorCode ? formik.errors.secondFactorCode : "123456aB"}
              value={formik.values.secondFactorCode}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              onFocus={handleFocus}
              maxLength={8}
              autoComplete="one-time-code" 
            />
          </div>
        </div>

        <Button type="submit" variant="submit" disabled={formik.isSubmitting || loading}>
          {loading ? 'Verifying...' : 'Verify'}
        </Button>
      </form>
      <div className="sign-in-form__footer">
        <p>Didn't receive code?
          <a onClick={resend2faCode} className="sign-in-form__link">
             Resend!
          </a>
        </p>
      </div>
    </div>
  );
};

export default Verify2faForm;