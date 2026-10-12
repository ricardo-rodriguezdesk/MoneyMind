/** Campo con estado visual: verde si es válido, rojo con mensaje si no. */
export default function TextField({ label, name, error, valid, ...inputProps }) {
  const state = error ? 'invalid' : valid ? 'valid' : '';
  return (
    <div className={`field ${state}`}>
      <label htmlFor={name}>{label}</label>
      <input id={name} name={name} {...inputProps} />
      {error && (
        <p className="field-error" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}
