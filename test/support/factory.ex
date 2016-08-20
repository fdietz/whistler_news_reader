defmodule WhistlerNewsReader.Factory do
  use ExMachina.Ecto, repo: WhistlerNewsReader.Repo

  alias WhistlerNewsReader.User
  alias WhistlerNewsReader.Feed
  alias WhistlerNewsReader.Subscription
  alias WhistlerNewsReader.Entry
  alias WhistlerNewsReader.SubscribedEntry
  alias WhistlerNewsReader.Category

  def user_factory do
    %User{
      name: "Jane Smith",
      email: sequence(:email, &"email-#{&1}@example.com"),
      encrypted_password: "encrypted_password"
    }
  end

  def feed_factory do
    %Feed{
      title: "The Verge",
      feed_url: "http://www.theverge.com/rss/frontpage",
      site_url: "http://www.theverge.com"
    }
  end

  def subscription_factory do
    %Subscription{
      user: build(:user),
      feed: build(:feed),
      category: build(:category)
    }
  end

  def entry_factory do
    %Entry{
      title: "Entry Title",
      published: "2016-01-01",
      feed: build(:feed)
    }
  end

  def unread_entry_factory do
    %SubscribedEntry{
      user: build(:user),
      entry: build(:entry),
      feed: build(:feed),
      subscription: build(:subscription),
      read: false
    }
  end

  def category_factory do
    %Category{
      title: "Category title",
      user: build(:user)
    }
  end

end
