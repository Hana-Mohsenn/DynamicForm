import { useState } from "react";
import { useForm } from "react-hook-form";
import styles from "./DynamicForm.module.css";

function DynamicForm({ config }) {
  const [showPassword, setShowPassword] = useState({});

  const {
    register,
    handleSubmit,
    getValues,
    formState: { errors },
  } = useForm();

  function togglePassword(fieldName) {
    setShowPassword({
      ...showPassword,
      [fieldName]: !showPassword[fieldName],
    });
  }

  function onSubmit(data) {
    console.log(data);
  }

  return (
    <form className={styles.registrationForm} onSubmit={handleSubmit(onSubmit)}>
      <h2>{config.title}</h2>
      <p>{config.description}</p>

      {config.fields.map((field) => {
        const validationRules = {};

        if (field.required) {
          validationRules.required = `${field.label} is required`;
        }

        if (field.name === "phone") {
          validationRules.pattern = {
            value: /^01[0-9]{9}$/,
            message: "Please enter a valid phone number",
          };
        }

        if (field.name === "password") {
          validationRules.minLength = {
            value: 8,
            message: "Password must be at least 8 characters",
          };

          validationRules.pattern = {
            value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])/,
            message:
              "Password must contain uppercase, lowercase, number and special character",
          };
        }

        if (field.name === "confirmPassword") {
          validationRules.validate = (value) =>
            value === getValues("password") || "Passwords do not match";
        }

        return (
          <div className={styles.formGroup} key={field.name}>
            {field.type === "checkbox" ? (
              <label className={styles.checkboxLabel}>
                <input
                  type="checkbox"
                  className={styles.formCheckbox}
                  {...register(field.name, validationRules)}
                />
                {field.label}
              </label>
            ) : (
              <>
                <label className={styles.formLabel}>{field.label}</label>

                {field.type === "select" ? (
                  <select
                    className={styles.formInput}
                    {...register(field.name, validationRules)}
                  >
                    <option value="">Select an option</option>

                    {field.options.map((option) => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
                  </select>
                ) : field.type === "password" ? (
                  <div className={styles.passwordInputWrapper}>
                    <input
                      type={showPassword[field.name] ? "text" : "password"}
                      className={styles.formInput}
                      placeholder={field.placeholder}
                      {...register(field.name, validationRules)}
                    />

                    <button
                      type="button"
                      className={styles.passwordToggle}
                      onClick={() => togglePassword(field.name)}
                      aria-label={
                        showPassword[field.name]
                          ? "Hide password"
                          : "Show password"
                      }
                    >
                      {showPassword[field.name] ? (
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="24"
                          height="24"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <path d="M2.062 12.348a1 1 0 0 1 0-.696 10.75 10.75 0 0 1 19.876 0 1 1 0 0 1 0 .696 10.75 10.75 0 0 1-19.876 0" />
                          <circle cx="12" cy="12" r="3" />
                        </svg>
                      ) : (
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="24"
                          height="24"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <path d="M10.733 5.076a10.744 10.744 0 0 1 11.205 6.575 1 1 0 0 1 0 .696 10.747 10.747 0 0 1-1.444 2.49" />
                          <path d="M14.084 14.158a3 3 0 0 1-4.242-4.242" />
                          <path d="M17.479 17.499a10.75 10.75 0 0 1-15.417-5.151 1 1 0 0 1 0-.696 10.75 10.75 0 0 1 4.446-5.143" />
                          <path d="m2 2 20 20" />
                        </svg>
                      )}
                    </button>
                  </div>
                ) : (
                  <input
                    type={field.type}
                    className={styles.formInput}
                    placeholder={field.placeholder}
                    maxLength={field.name === "phone" ? 11 : undefined}
                    inputMode={field.name === "phone" ? "numeric" : undefined}
                    {...register(field.name, {
                      ...validationRules,
                      onChange: (event) => {
                        if (field.name === "phone") {
                          event.target.value = event.target.value
                            .replace(/\D/g, "")
                            .slice(0, 11);
                        }
                      },
                    })}
                  />
                )}
              </>
            )}

            {errors[field.name] && (
              <span className={styles.errorMessage}>
                {errors[field.name].message}
              </span>
            )}
          </div>
        );
      })}

      <button type="submit" className={styles.submitButton}>
        Register
      </button>
    </form>
  );
}

export default DynamicForm;
