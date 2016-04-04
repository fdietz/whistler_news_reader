defmodule WhistlerNewsReader.Factory do
  use ExMachina.Ecto, repo: WhistlerNewsReader.Repo

  alias WhistlerNewsReader.User
  alias WhistlerNewsReader.Feed
  alias WhistlerNewsReader.Subscription
  alias WhistlerNewsReader.Entry
  alias WhistlerNewsReader.UnreadEntry
  alias WhistlerNewsReader.Category

  def factory(:user) do
    %User{
      first_name: "Jane",
      last_name: "Smith",
      email: sequence(:email, &"email-#{&1}@example.com"),
      encrypted_password: "password"
    }
  end

  def factory(:feed) do
    %Feed{
      title: "The Verge",
      feed_url: "http://www.theverge.com/rss/frontpage",
      site_url: "http://www.theverge.com"
    }
  end

  def factory(:subscription) do
    %Subscription{
      user: build(:user),
      feed: build(:feed),
      category: build(:category)
    }
  end

  def factory(:entry) do
    %Entry{
      title: "Entry Title",
      published: "2016-01-01",
      feed: build(:feed)
    }
  end

  def factory(:unread_entry) do
    %UnreadEntry{
      user: build(:user),
      entry: build(:entry),
      feed: build(:feed),
      read: false
    }
  end

  def factory(:category) do
    %Category{
      title: "Category title",
      user: build(:user)
    }
  end

end