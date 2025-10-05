import { useState, useEffect } from "react";
import { Button } from "../../components/utils/Button";
import { Input } from "../../components/utils/Input";
import { Select } from "../../components/utils/icons/Select";
import { useMovies } from "../../hooks/useMovies";
import type { MovieType } from "../../types/movie.types";
import type { UpdateMovieType } from "../../context/movieContext";

type Props = {
  setShow: (show: boolean) => void;
  movie: MovieType;
};

type FormData = {
  id: number;
  title: string;
  subtitle: string;
  originalTitle: string;
  synopsis: string;
  poster: File | null;
  background: File | null;
  trailer: File | null;
  releaseDate: string;
  ageRating: number;
  rating: number;
  duration: number;
  director: string;
  genres: string;
  language: string;
  budget: string;
  revenue: string;
};

export const EditForm = ({ setShow, movie }: Props) => {
  const { update } = useMovies();

  const formatCurrency = (value: number): string => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
      minimumFractionDigits: 2,
    }).format(value);
  };

  const formatDate = (dateString: string): string => {
    if (!dateString) return "";
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const initialFormData: FormData = {
    id: movie.id,
    title: movie.title || "",
    subtitle: movie.subtitle || "",
    originalTitle: movie.original_title || "",
    synopsis: movie.synopsis || "",
    poster: null,
    background: null,
    trailer: null,
    releaseDate: formatDate(String(movie.release_date)) || "",
    ageRating: Number(movie.age_rating) || 12,
    rating: movie.rating || 1,
    duration: Number(movie.duration) || 1,
    director: movie.director || "",
    genres: Array.isArray(movie.genres) ? movie.genres.join(", ") : movie.genres || "",
    language: movie.language || "Português",
    budget: movie.budget ? formatCurrency(movie.budget) : "",
    revenue: movie.revenue ? formatCurrency(movie.revenue) : "",
  };

  const [formData, setFormData] = useState<FormData>(initialFormData);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setFormData({
        id: movie.id,
        title: movie.title || "",
        subtitle: movie.subtitle || "",
        originalTitle: movie.original_title || "",
        synopsis: movie.synopsis || "",
        poster: null,
        background: null,
        trailer: null,
        releaseDate: formatDate(String(movie.release_date)) || "",
        ageRating: Number(movie.age_rating) || 12,
        rating: movie.rating || 1,
        duration: Number(movie.duration) || 1,
        director: movie.director || "",
        genres: Array.isArray(movie.genres) ? movie.genres.join(", ") : movie.genres || "",
        language: movie.language || "Português",
        budget: movie.budget ? formatCurrency(movie.budget) : "",
        revenue: movie.revenue ? formatCurrency(movie.revenue) : "",
    });
  }, [movie]);

  const handleCancel = () => {
    setFormData(initialFormData);
    setShow(false);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const numericBudget = Number(
      formData.budget.replace(/[^\d,]/g, "").replace(",", ".")
    );
    const numericRevenue = Number(
      formData.revenue.replace(/[^\d,]/g, "").replace(",", ".")
    );

    const movieData: UpdateMovieType = {
      ...formData,
      budget: numericBudget,
      revenue: numericRevenue,
    };

    try {
      const response = await update(movieData);
      if (response.success) {
        return handleCancel();
      } else {
        setError("Erro ao atualizar filme. " + response.error);
        console.error("Erro ao atualizar filme:", response.error);
      }
    } catch (error) {
      setError("Erro ao atualizar filme. Por favor, tente novamente.");
      console.error("Erro ao atualizar filme:", error);
    }
  };

  const getNumberOptions = (start: number, end: number) =>
    Array.from({ length: end - start + 1 }, (_, i) => i + start).map((num) => ({
      value: `${num}`,
      label: num === 18 ? `${num}+` : `${num}`,
    }));

  const languageOptions = [
    { value: "Português", label: "Português" },
    { value: "Inglês", label: "Inglês" },
    { value: "Espanhol", label: "Espanhol" },
    { value: "Mandarim", label: "Mandarim" },
  ];

  return (
    <div className="max-h-full">
      <form
        onSubmit={handleSubmit}
        className="grid grid-cols-1 sm:grid-cols-2 gap-[16px] mt-[16px]"
      >
        <Input
          required
          type="text"
          label="Título"
          name="title"
          placeholder="Digite o título do filme"
          value={formData.title}
          onChange={(e) =>
            setFormData({ ...formData, title: e.target.value })
          }
        />
        <Input
          required
          type="text"
          label="Subtítulo"
          name="subtitle"
          placeholder="Digite o subtítulo do filme"
          value={formData.subtitle}
          onChange={(e) =>
            setFormData({ ...formData, subtitle: e.target.value })
          }
        />
        <Input
          required
          type="text"
          label="Título Original"
          name="originalTitle"
          placeholder="Digite o título original do filme"
          value={formData.originalTitle}
          onChange={(e) =>
            setFormData({ ...formData, originalTitle: e.target.value })
          }
        />
        <Input
          required
          type="text"
          label="Sinopse"
          name="synopsis"
          placeholder="Digite a sinopse do filme"
          value={formData.synopsis}
          onChange={(e) =>
            setFormData({ ...formData, synopsis: e.target.value })
          }
        />

        <Input
          type="file"
          label="Imagem (deixe vazio para manter a atual)"
          name="poster"
          onChange={(e) => {
            const files = e.target.files;
            if (files && files.length > 0)
              setFormData({ ...formData, poster: files[0] });
          }}
        />
        <Input
          type="file"
          label="Capa (deixe vazio para manter a atual)"
          name="background"
          onChange={(e) => {
            const files = e.target.files;
            if (files && files.length > 0)
              setFormData({ ...formData, background: files[0] });
          }}
        />
        <Input
          type="file"
          label="Trailer (deixe vazio para manter o atual)"
          name="trailer"
          onChange={(e) => {
            const files = e.target.files;
            if (files && files.length > 0)
              setFormData({ ...formData, trailer: files[0] });
          }}
        />

        <Input
          required
          type="date"
          label="Data de Lançamento"
          name="releaseDate"
          value={formData.releaseDate}
          onChange={(e) =>
            setFormData({ ...formData, releaseDate: e.target.value })
          }
        />

        <Select
          required
          options={getNumberOptions(12, 18)}
          label="Classificação Indicativa"
          name="ageRating"
          value={String(formData.ageRating)}
          onChange={(e) =>
            setFormData({ ...formData, ageRating: Number(e.target.value) })
          }
        />

        <Input
          required
          type="text"
          label="Duração"
          name="duration"
          placeholder="Digite a duração do filme"
          value={String(formData.duration)}
          onChange={(e) =>
            setFormData({ ...formData, duration: Number(e.target.value) })
          }
          variant="time"
        />

        <Input
          required
          type="text"
          label="Diretor"
          name="director"
          placeholder="Digite o nome do diretor"
          value={formData.director}
          onChange={(e) =>
            setFormData({ ...formData, director: e.target.value })
          }
        />
        <Input
          required
          type="text"
          label="Gêneros"
          name="genres"
          placeholder="Digite os gêneros do filme"
          value={formData.genres}
          onChange={(e) =>
            setFormData({ ...formData, genres: e.target.value })
          }
        />

        <Select
          required
          options={languageOptions}
          label="Língua"
          name="language"
          value={formData.language}
          onChange={(e) =>
            setFormData({ ...formData, language: e.target.value })
          }
        />

        <Select
          required
          options={getNumberOptions(1, 10)}
          label="Avaliação"
          name="rating"
          value={String(formData.rating)}
          onChange={(e) =>
            setFormData({ ...formData, rating: Number(e.target.value) })
          }
        />

        <Input
          required
          type="text"
          label="Orçamento"
          name="budget"
          placeholder="Digite o orçamento do filme"
          value={formData.budget}
          onChange={(e) =>
            setFormData({ ...formData, budget: e.target.value })
          }
          variant="currency"
        />

        <Input
          required
          type="text"
          label="Receita"
          name="revenue"
          placeholder="Digite a receita do filme"
          value={formData.revenue}
          onChange={(e) =>
            setFormData({ ...formData, revenue: e.target.value })
          }
          variant="currency"
        />
        {error && (
          <div className="text-red-500 text-sm col-span-2">{error}</div>
        )}
        <div className="flex justify-end items-end gap-[16px] col-span-2">
          <Button
            class="max-h-[40px]"
            text="Cancelar"
            variant="secondary"
            onClick={handleCancel}
            type="button"
          />
          <Button
            class="max-h-[40px]"
            text="Editar Filme"
            variant="primary"
            type="submit"
          />
        </div>
      </form>
    </div>
  );
};