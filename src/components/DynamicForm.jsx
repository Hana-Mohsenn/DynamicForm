import { useState } from "react";
import { useForm } from "react-hook-form";
import styles from "./DynamicForm.module.css";

function TextField({ field, register, rules, error }) {
  return (
    <>
      <label className={styles.formLabel}>{field.label}</label>

      <input
        type={field.type}
        className={styles.formInput}
        placeholder={field.placeholder}
        {...register(field.name, rules)}
      />

      {error && <span className={styles.errorMessage}>{error.message}</span>}
    </>
  );
}

function EmailField({ field, register, rules, error }) {
  return (
    <>
      <label className={styles.formLabel}>{field.label}</label>

      <input
        type={field.type}
        className={styles.formInput}
        placeholder={field.placeholder}
        {...register(field.name, rules)}
      />

      {error && <span className={styles.errorMessage}>{error.message}</span>}
    </>
  );
}

function PhoneField({ field, register, rules, error }) {
  return (
    <>
      <label className={styles.formLabel}>{field.label}</label>

      <input
        type={field.type}
        className={styles.formInput}
        placeholder={field.placeholder}
        maxLength={11}
        inputMode="numeric"
        {...register(field.name, {
          ...rules,
          onChange: (event) => {
            event.target.value = event.target.value
              .replace(/\D/g, "")
              .slice(0, 11);
          },
        })}
      />

      {error && <span className={styles.errorMessage}>{error.message}</span>}
    </>
  );
}

function PasswordField({
  field,
  register,
  rules,
  error,
  showPassword,
  togglePassword,
}) {
  return (
    <>
      <label className={styles.formLabel}>{field.label}</label>

      <div className={styles.passwordInputWrapper}>
        <input
          type={showPassword[field.name] ? "text" : "password"}
          className={styles.formInput}
          placeholder={field.placeholder}
          {...register(field.name, rules)}
        />

        <button
          type="button"
          className={styles.passwordToggle}
          onClick={() => togglePassword(field.name)}
          aria-label={
            showPassword[field.name] ? "Hide password" : "Show password"
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

      {error && <span className={styles.errorMessage}>{error.message}</span>}
    </>
  );
}

function SelectField({ field, register, rules, error }) {
  return (
    <>
      <label className={styles.formLabel}>{field.label}</label>

      <select className={styles.formInput} {...register(field.name, rules)}>
        <option value="">Select an option</option>

        {field.options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>

      {error && <span className={styles.errorMessage}>{error.message}</span>}
    </>
  );
}

function CheckboxField({ field, register, rules, error }) {
  return (
    <>
      <label className={styles.checkboxLabel}>
        <input
          type="checkbox"
          className={styles.formCheckbox}
          {...register(field.name, rules)}
        />

        {field.label}
      </label>

      {error && <span className={styles.errorMessage}>{error.message}</span>}
    </>
  );
}

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
    window.location.reload();
  }

  function renderField(field, rules) {
    const props = {
      field,
      register,
      rules,
      error: errors[field.name],
    };

    switch (field.type) {
      case "text":
        return <TextField {...props} />;

      case "email":
        return <EmailField {...props} />;

      case "tel":
        return <PhoneField {...props} />;

      case "password":
        return (
          <PasswordField
            {...props}
            showPassword={showPassword}
            togglePassword={togglePassword}
          />
        );

      case "select":
        return <SelectField {...props} />;

      case "checkbox":
        return <CheckboxField {...props} />;

      default:
        return null;
    }
  }

  return (
    <form className={styles.registrationForm} onSubmit={handleSubmit(onSubmit)}>
      <h2>{config.title}</h2>
      <p>{config.description}</p>

      {config.fields.map((field) => {
        const rules = {};

        if (field.required) {
          rules.required = `${field.label} is required`;
        }

        if (field.type === "tel") {
          rules.pattern = {
            value: /^01[0-9]{9}$/,
            message: "Please enter a valid phone number",
          };
        }

        if (field.name === "password") {
          rules.minLength = {
            value: 8,
            message: "Password must be at least 8 characters",
          };

          rules.pattern = {
            value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])/,
            message:
              "Password must contain uppercase, lowercase, number and special character",
          };
        }

        if (field.name === "confirmPassword") {
          rules.validate = (value) =>
            value === getValues("password") || "Passwords do not match";
        }

        return (
          <div className={styles.formGroup} key={field.name}>
            {renderField(field, rules)}
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
