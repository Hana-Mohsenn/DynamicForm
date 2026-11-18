import DynamicForm from "./components/DynamicForm";
import form from "./data/form.json";
import styles from "./App.module.css";

function App() {
  return (
    <div className={styles.page}>
      <div className={styles.formCard}>
        <h1>Registration Form</h1>
        <DynamicForm config={form} />
      </div>
    </div>
  );
}

export default App;
