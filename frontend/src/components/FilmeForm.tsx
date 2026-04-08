import type { FormEvent } from 'react';

interface FilmeFormProps {
  titulo: string;
  sinopse: string;
  genero: string;
  classificacao: string;
  duracao: string;
  dataEstreia: string;
  imagem: string;
  imagemPreview: string;
  errors: Record<string, string>;
  loading: boolean;
  editandoId: string | null;
  onTituloChange: (value: string) => void;
  onSinopseChange: (value: string) => void;
  onGeneroChange: (value: string) => void;
  onClassificacaoChange: (value: string) => void;
  onDuracaoChange: (value: string) => void;
  onDataEstreiaChange: (value: string) => void;
  onImagemChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onRemoverImagem: () => void;
  onSubmit: (e: FormEvent) => void;
  onCancelar: () => void;
}

export function FilmeForm({
  titulo,
  sinopse,
  genero,
  classificacao,
  duracao,
  dataEstreia,
  imagem,
  imagemPreview,
  errors,
  loading,
  editandoId,
  onTituloChange,
  onSinopseChange,
  onGeneroChange,
  onClassificacaoChange,
  onDuracaoChange,
  onDataEstreiaChange,
  onImagemChange,
  onSubmit,
  onCancelar,
}: FilmeFormProps) {
  return (
    <div className="card mb-4 shadow-sm">
      <div className="card-header bg-white">
        <h5 className="mb-0">
          {editandoId ? (
            <>
              <i className="bi bi-pencil-square me-2"></i>Editar Filme
            </>
          ) : (
            <>
              <i className="bi bi-plus-circle me-2"></i>Cadastrar Novo Filme
            </>
          )}
        </h5>
      </div>
      <div className="card-body">
        <form onSubmit={onSubmit}>
          <div className="row g-3">
            <div className="col-md-12">
              <label htmlFor="inputTitulo" className="form-label fw-bold">
                Título do Filme <span className="text-danger">*</span>
              </label>
              <input
                type="text"
                className={`form-control ${errors.titulo ? 'is-invalid' : ''}`}
                id="inputTitulo"
                placeholder="Digite o título do filme"
                value={titulo}
                onChange={(e) => onTituloChange(e.target.value)}
                disabled={loading}
              />
              {errors.titulo && <div className="invalid-feedback">{errors.titulo}</div>}
            </div>

            <div className="col-md-12">
              <label htmlFor="inputSinopse" className="form-label fw-bold">
                Sinopse <span className="text-danger">*</span>
              </label>
              <textarea
                className={`form-control ${errors.sinopse ? 'is-invalid' : ''}`}
                id="inputSinopse"
                rows={4}
                placeholder="Digite a sinopse do filme"
                value={sinopse}
                onChange={(e) => onSinopseChange(e.target.value)}
                disabled={loading}
              />
              {errors.sinopse && <div className="invalid-feedback">{errors.sinopse}</div>}
            </div>

            <div className="col-md-6">
              <label htmlFor="select-genero" className="form-label fw-bold">
                Gênero <span className="text-danger">*</span>
              </label>
              <select
                className={`form-select ${errors.genero ? 'is-invalid' : ''}`}
                id="select-genero"
                value={genero}
                onChange={(e) => onGeneroChange(e.target.value)}
                disabled={loading}
              >
                <option value="">Selecione o gênero</option>
                <option value="Ação">Ação</option>
                <option value="Comédia">Comédia</option>
                <option value="Drama">Drama</option>
                <option value="Ficção científica">Ficção Científica</option>
                <option value="Terror">Terror</option>
              </select>
              {errors.genero && <div className="invalid-feedback">{errors.genero}</div>}
            </div>

            <div className="col-md-6">
              <label htmlFor="select-classificacao" className="form-label fw-bold">
                Classificação Indicativa <span className="text-danger">*</span>
              </label>
              <select
                className={`form-select ${errors.classificacao ? 'is-invalid' : ''}`}
                id="select-classificacao"
                value={classificacao}
                onChange={(e) => onClassificacaoChange(e.target.value)}
                disabled={loading}
              >
                <option value="">Selecione a classificação</option>
                <option value="livre">Livre</option>
                <option value="10">10 anos</option>
                <option value="12">12 anos</option>
                <option value="14">14 anos</option>
                <option value="16">16 anos</option>
                <option value="18">18 anos</option>
              </select>
              {errors.classificacao && (
                <div className="invalid-feedback">{errors.classificacao}</div>
              )}
            </div>

            <div className="col-md-6">
              <label htmlFor="input-duracao" className="form-label fw-bold">
                Duração (minutos) <span className="text-danger">*</span>
              </label>
              <input
                type="number"
                className={`form-control ${errors.duracao ? 'is-invalid' : ''}`}
                id="input-duracao"
                placeholder="Ex: 120"
                min="1"
                max="500"
                value={duracao}
                onChange={(e) => onDuracaoChange(e.target.value)}
                disabled={loading}
              />
              {errors.duracao && <div className="invalid-feedback">{errors.duracao}</div>}
            </div>

            <div className="col-md-6">
              <label htmlFor="input-data-estreia" className="form-label fw-bold">
                Data de Estreia <span className="text-danger">*</span>
              </label>
              <input
                type="date"
                className={`form-control ${errors.dataEstreia ? 'is-invalid' : ''}`}
                id="input-data-estreia"
                value={dataEstreia}
                onChange={(e) => onDataEstreiaChange(e.target.value)}
                disabled={loading}
              />
              {errors.dataEstreia && <div className="invalid-feedback">{errors.dataEstreia}</div>}
            </div>

            <div className="col-md-12">
              <label htmlFor="input-imagem" className="form-label fw-bold">
                URL da Imagem {!editandoId && <span className="text-danger">*</span>}
              </label>
              <input
                type="url"
                className={`form-control ${errors.imagem ? 'is-invalid' : ''}`}
                id="input-imagem"
                placeholder="https://exemplo.com/imagem.jpg"
                value={imagem}
                onChange={onImagemChange}
                disabled={loading}
              />
              <div className="form-text">Cole o link de uma imagem da web</div>
              {errors.imagem && <div className="invalid-feedback d-block">{errors.imagem}</div>}

              {imagemPreview && (
                <div className="mt-3" id="preview-container">
                  <div className="d-flex align-items-start gap-2">
                    <img
                      src={imagemPreview}
                      alt="Preview"
                      className="img-thumbnail"
                      style={{ maxWidth: '200px', maxHeight: '300px', objectFit: 'cover' }}
                      onError={(e) => {
                        e.currentTarget.style.display = 'none';
                      }}
                    />
                  </div>
                </div>
              )}
            </div>

            <div className="col-12 mt-4">
              <div className="d-flex gap-2">
                <button type="submit" className="btn btn-primary" disabled={loading}>
                  {loading ? (
                    <>
                      <span
                        className="spinner-border spinner-border-sm me-2"
                        role="status"
                        aria-hidden="true"
                      ></span>
                      Salvando...
                    </>
                  ) : (
                    <>
                      <i className="bi bi-check-circle me-2"></i>
                      {editandoId ? 'Atualizar Filme' : 'Cadastrar Filme'}
                    </>
                  )}
                </button>
                {editandoId && (
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={onCancelar}
                    disabled={loading}
                  >
                    <i className="bi bi-x-circle me-2"></i>Cancelar
                  </button>
                )}
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
