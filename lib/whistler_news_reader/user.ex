defmodule WhistlerNewsReader.User do
  use Ecto.Schema   
  import Ecto.Changeset
  import Ecto.Query
  
  schema "users" do
    field :name, :string
    field :email, :string
    field :encrypted_password, :string
    field :password, :string, virtual: true

    embeds_one :settings, WhistlerNewsReader.Settings, on_replace: :delete
    has_many :subscriptions, WhistlerNewsReader.Subscription

    timestamps
  end

  # @derive {Poison.Encoder, only: [:id, :first_name, :last_name, :email]}

  @required_fields ~w(name email password)
  @optional_fields ~w(encrypted_password)
  @fields @required_fields ++ @optional_fields

  @doc """
  Creates a changeset based on the `model` and `params`.

  If no params are provided, an invalid changeset is returned
  with no validation performed.
  """
  def changeset(model, params \\ %{}) do
    model
    |> cast(params, [:name, :email, :password, :encrypted_password])
    |> validate_required([:name, :email, :password])
    |> validate_format(:email, ~r/@/)
    |> validate_length(:email, min: 5)
    |> validate_confirmation(:password, message: "Password does not match")
    |> unique_constraint(:email, message: "Email already taken")
    |> generate_encrypted_password
    |> cast_embed(:settings)
  end

  defp generate_encrypted_password(current_changeset) do
    case current_changeset do
      %Ecto.Changeset{valid?: true, changes: %{password: password}} ->
        put_change(current_changeset, :encrypted_password, Comeonin.Bcrypt.hashpwsalt(password))
      _ ->
        current_changeset
    end
  end
end
