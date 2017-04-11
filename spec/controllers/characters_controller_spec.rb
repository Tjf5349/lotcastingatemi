require 'rails_helper'
require "#{Rails.root}/spec/controllers/shared_examples/respond_to_unauthenticated.rb"

RSpec.describe Api::V1::CharactersController, type: :controller do

  def authenticated_header(user)
    token = Knock::AuthToken.new(payload: { sub: user.id }).token
    "Bearer #{token}"
  end

  before(:each) do
    @player = FactoryGirl.create(:player)
    @character = FactoryGirl.create(:character, player_id: @player.id)
  end

  describe "GET #show" do
    it "returns http success" do
      request.headers['Authorization'] = authenticated_header(@player)
      get :show, params: { id: @character, format: :json }
      expect(response).to have_http_status(:success)
    end

    it_behaves_like "respond_to_unauthenticated", 'show'
  end

  describe "POST #create" do
    context "With valid attributes" do
      it "Increases Character count by 1" do
        request.headers['Authorization'] = authenticated_header(@player)
        @chronicle = FactoryGirl.create(:chronicle)
        @character_params = FactoryGirl.attributes_for(:character, chronicle_id: @chronicle.id, player_id: @player.id)

        expect { post :create, params: { :character => @character_params }, format: :json }.to change(Character, :count).by(1)
      end
    end

    context "With invalid attributes" do
      it "Increases Character count by 0" do
        request.headers['Authorization'] = authenticated_header(@player)
        @chronicle = FactoryGirl.create(:chronicle)
        @invalid_character_params = FactoryGirl.attributes_for(:character, chronicle_id: "Invalid", player_id: "Attribute")

        expect { post :create, params: { :character => @invalid_character_params }, format: :json }.to change(Character, :count).by(0)
      end
    end

    it_behaves_like "respond_to_unauthenticated", 'create'
  end

  describe "DELETE #destroy" do
    it "Decreases Character count by 1" do
      request.headers['Authorization'] = authenticated_header(@player)
      expect { delete :destroy, params: { id: @character.id, format: :json } }.to change(Character, :count).by(-1)
    end

    it_behaves_like "respond_to_unauthenticated", 'destroy'
  end

  describe "PATCH #update" do
    context "With valid attributes" do
      it "Updates character attributes" do
        request.headers['Authorization'] = authenticated_header(@player)
        @chronicle = FactoryGirl.create(:chronicle)
        @updated_character_params = FactoryGirl.attributes_for(:character, essence: 5, attr_wits: 5)

        expect(@character.essence).not_to eq(5)
        expect(@character.attr_wits).not_to eq(5)

        patch :update, params: { id: @character.id, character: @updated_character_params, format: :json }
        @character.reload

        expect(@character.essence).to eq(5)
        expect(@character.attr_wits).to eq(5)
      end
    end

    context "With invalid attributes" do
      it "Updates character attributes" do
        request.headers['Authorization'] = authenticated_header(@player)
        @chronicle = FactoryGirl.create(:chronicle)
        @invalid_updated_character_params = FactoryGirl.attributes_for(:character, essence: -1, )

        expect(@character.essence).not_to eq(-1)

        patch :update, params: { id: @character.id, character: @invalid_updated_character_params, format: :json }
        @character.reload

        expect(@character.essence).not_to eq(-1)
      end
    end

    it_behaves_like "respond_to_unauthenticated", 'update'
  end
  
end
